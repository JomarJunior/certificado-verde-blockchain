import { Box, Button, Chip, Container, Dialog, Divider, Grid, Icon, Paper, Stack, ThemeProvider, Typography } from "@mui/material";
import { ethers } from "ethers";
import jsPDF from "jspdf";
import React from "react";
import { useParams } from "react-router-dom";
import { Margin, usePDF, type Options } from "react-to-pdf";
import type { Certificate } from "../../api/certificate-api";
import type { Certifier } from "../../api/certifier-api";
import type { Producer } from "../../api/producer-api";
import type { Product } from "../../api/product-api";
import { useApp } from "../../hooks/useApp";
import { useCertificateContext } from "../../hooks/useCertificate";
import { useCertifierContext } from "../../hooks/useCertifier";
import { useProducerContext } from "../../hooks/useProducer";
import { useProductContext } from "../../hooks/useProduct";
import defaultTheme from "../../themes/default";
import printTheme from "../../themes/print";

interface SignPreIssueHashResponse {
    signature: string;
    certifier_address: string;
}

const signPreIssueHash = async (preIssuedHash: string): Promise<SignPreIssueHashResponse> => {
    // Check for Ethereum provider
    // @ts-expect-error window.ethereum is injected by MetaMask
    const windowEthereum = window.ethereum;
    if (!windowEthereum) {
        throw new Error("Ethereum provider not found. Please install MetaMask.");
    }

    // Create ethers provider and signer
    const provider = new ethers.BrowserProvider(windowEthereum);
    const signer = await provider.getSigner();

    // Sign the pre-issued hash
    const signature = await signer.signMessage(ethers.getBytes('0x' + preIssuedHash));
    const certifierAddress = await signer.getAddress();

    return {
        signature,
        certifier_address: certifierAddress
    };
}

const CertificateItem: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
    <Stack direction="row" spacing={{ xs: 1, sm: 2 }} alignItems="center" mb={2}>
        {icon && (
            <Stack sx={{ display: { xs: 'none', sm: 'block' } }}>
                {icon}
            </Stack>
        )}
        <Stack>
            <Typography sx={{ fontSize: { xs: '1rem', sm: '1.2rem', md: 24 } }}>{label}</Typography>
            <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: 18 }, wordBreak: 'break-word' }} color="textSecondary">{value}</Typography>
        </Stack>
    </Stack>
);

const NORM_EMOJI_MAP: Record<string, string> = {
    'ISO 14001': '🌍',
    'Rainforest Alliance': '🌳',
    'FSC': '🪵',
    'LEED': '⚡',
    'IDB.org': '🏦',
    'Other': '✅',
};

const NormBadge: React.FC<{ norm: string }> = ({ norm }) => (
    <Chip
        label={`${NORM_EMOJI_MAP[norm] || '✅'} ${norm}`}
        sx={{
            margin: 0.5,
            fontSize: { xs: '0.75rem', sm: '1rem', md: '25pt' },
            padding: { xs: '8px', sm: '15px', md: '25px' },
            fontFamily: 'bungee'
        }}
        color="primary"
    />
);

const SC_EMOJI_MAP: Record<string, string> = {
    'Organic': '🌱',
    'Legal Origin': '⚖️',
    'Forest Management Plan': '🌲',
    'Biodiversity Maintenance': '🦜',
    'Complete Traceability': '🔍',
    'Exploitation Limits': '🚫',
    'Working Conditions': '👷',
    'Valid Environmental License': '📄',
    'Other': '✅',
};

const SustainabilityCriterionBadge: React.FC<{ criterion: string }> = ({ criterion }) => (
    <Chip
        label={`${SC_EMOJI_MAP[criterion] || '✅'} ${criterion}`}
        sx={{
            margin: 0.5,
            fontSize: { xs: '0.75rem', sm: '1rem', md: '25pt' },
            padding: { xs: '8px', sm: '15px', md: '25px' },
            fontFamily: 'bungee'
        }}
        color="secondary"
    />
);

const NormalizeMetadataLabels = (label: string): string => {
    const withSpaces = label.replaceAll('_', ' ');
    const titleCased = withSpaces.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    return titleCased;
}

const SmoothScrollToTop = () => {
    // Move the window to the top to show any messages
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

const PDF_OPTIONS: Options = {
    filename: 'certificado_verde.pdf',
    method: 'build',
    page: {
        margin: Margin.MEDIUM,
    },
    canvas: {
        mimeType: 'image/png',
        qualityRatio: 1,
    }
}

const IssueCertificate: React.FC = () => {
    const { id: certificateId } = useParams<{ id: string }>();
    const { fetchOneCertificateById, isLoading, issuePreCertificate, registerPDFHash } = useCertificateContext();
    const { fetchAllProducts, isLoading: isProductsLoading, products } = useProductContext();
    const { fetchAllProducers, isLoading: isProducersLoading, producers } = useProducerContext();
    const { fetchAllCertifiers, isLoading: isCertifiersLoading, certifiers } = useCertifierContext();
    const { setDocumentTitle } = useApp();
    const [preCertificate, setPreCertificate] = React.useState<Certificate>({} as Certificate);
    const [showConfirmationModal, setShowConfirmationModal] = React.useState(false);
    const [isDownloading, setIsDownloading] = React.useState(false);
    const { toPDF, targetRef } = usePDF(PDF_OPTIONS);

    React.useEffect(() => {
        const fetchPreCertificate = async () => {
            if (certificateId) {
                const cert = await fetchOneCertificateById(certificateId);
                setPreCertificate(cert);
            }
        };
        void fetchPreCertificate();
        void fetchAllProducts();
        void fetchAllProducers();
        void fetchAllCertifiers();
    }, [certificateId, fetchOneCertificateById, fetchAllProducts, fetchAllProducers, fetchAllCertifiers, showConfirmationModal]);

    React.useEffect(() => {
        if (preCertificate.issued_at === null) {
            setDocumentTitle('Emitir Certificado');
        } else {
            setDocumentTitle('Visualizar Certificado');
        }
    }, [setDocumentTitle, preCertificate]);

    React.useLayoutEffect(() => {
        if (!isDownloading) {
            return;
        }

        const doDownload = async () => {
            // @ts-expect-error toPDF returns a Promise<jsPDF>
            toPDF().then((pdfInstance: jsPDF) => {
                pdfInstance.save(`certificado_verde_${preCertificate.id}.pdf`);

                console.log(preCertificate);
                if (!preCertificate.authenticity_proof.pdf_hash) {
                    const pdfBase64 = pdfInstance.output('datauristring').split(',')[1];
                    void registerPDFHash(preCertificate.id, { pdf_file: pdfBase64 })
                        .then((pdfHash) => {
                            console.log("PDF hash registered successfully:", pdfHash);
                        })
                        .catch((error) => {
                            console.error("Error registering PDF hash:", error);
                        });
                }
            });

            setIsDownloading(false);
        }
        void doDownload();
    }, [isDownloading, toPDF, preCertificate.id, registerPDFHash, preCertificate?.authenticity_proof?.pdf_hash]);



    if (isLoading || isProductsLoading || isProducersLoading || isCertifiersLoading) {
        return <div>Loading...</div>;
    }

    if (!preCertificate) {
        return <div>Pré-Certificado não encontrado.</div>;
    }

    const handleConfirmAndIssue = async () => {
        try {
            if (!preCertificate.pre_issued_hash) {
                throw new Error("Pre-issued hash is missing.");
            }
            const { signature, certifier_address } = await signPreIssueHash(preCertificate.pre_issued_hash);

            const issueCertificateRequest = {
                certifier_address,
                certifier_signature: signature
            };

            await issuePreCertificate(preCertificate.id, issueCertificateRequest);

            setTimeout(() => {
                SmoothScrollToTop();
                setIsDownloading(true);
            }, 100);
        } catch (error) {
            console.error("Error during certificate issuance:", error);
            alert("Ocorreu um erro ao emitir o certificado. Por favor, tente novamente.");
        }
    };

    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    }

    const handleOpenConfirmationModal = () => {
        setShowConfirmationModal(true);
    }

    const handleDownloadCertificate = () => {
        if (!isIssued) return;

        setIsDownloading(true);
    }

    const product: Product = products?.find(p => p.id === preCertificate.product_id) as Product;
    const producer: Producer = producers?.find(p => p.id === preCertificate.producer_id) as Producer;
    const certifier: Certifier = certifiers?.find(c => c.id === preCertificate.certifier_id) as Certifier;

    const isIssued = preCertificate.issued_at !== null;

    if (!product || !producer || !certifier) {
        return <div>Não foi possível encontrar as entidades relacionadas.</div>;
    }

    return (
        <ThemeProvider theme={isDownloading ? printTheme : defaultTheme}>
            <Container maxWidth="xl">
                <Paper elevation={3} sx={{ padding: 2, marginBottom: 4 }}>
                    {isIssued && (
                        <Box display={'flex'} justifyContent={{ xs: 'center', sm: 'end' }} alignItems={'center'} mb={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                sx={{
                                    fontFamily: 'bungee',
                                    fontSize: { xs: '0.875rem', sm: '1rem', md: '18pt' },
                                    padding: { xs: '8px 16px', sm: '10px 20px' }
                                }}
                                onClick={handleDownloadCertificate}
                            >
                                <Icon sx={{ marginRight: { xs: 1, sm: 5 } }}>download</Icon>
                                Download
                            </Button>
                        </Box>
                    )}
                    <span ref={targetRef as React.RefObject<HTMLDivElement>}>
                        <Grid container spacing={0} alignItems="center" justifyContent={"center"} mb={2}>
                            {isIssued && (
                                <Grid size={{ xs: 12, md: 1 }} display="flex" justifyContent="center" alignItems="center" sx={{ mb: { xs: 2, md: 0 } }}>
                                    {preCertificate.authenticity_proof && preCertificate.authenticity_proof.qr_code_url && (
                                        <img
                                            src={preCertificate.authenticity_proof.qr_code_url}
                                            alt="QR Code do Certificado"
                                            style={{ maxWidth: '150px', width: '100%', height: 'auto', marginLeft: 0 }}
                                        />)}
                                </Grid>
                            )}
                            <Grid size={{ xs: 12, md: isIssued ? 11 : 12 }}>
                                <Box display="flex" flexDirection={'column'} justifyContent="center" alignItems="center" mb={2}>
                                    {!isIssued ? (
                                        <Typography gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '2rem', sm: '3rem', md: '72pt' } }} textAlign="center">
                                            Emitir Certificado
                                        </Typography>
                                    ) : (
                                        <Box textAlign={'center'}>
                                            <Typography gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem', md: '72pt' } }}>
                                                Certificado <span style={{ color: defaultTheme.palette.success.main }}>Verde</span>
                                            </Typography>
                                            <Typography gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.5rem', sm: '2.5rem', md: '72pt' } }}>
                                                Blockchain
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                        <Divider sx={{ marginY: 2 }} />
                        <Box>
                            <Grid container spacing={2}>
                                <Grid size={12} display={'flex'} flexDirection={'column'} alignItems={'center'}>
                                    <Typography
                                        gutterBottom
                                        fontFamily={'Fira Mono'}
                                        sx={{
                                            fontSize: { xs: '0.75rem', sm: '1.5rem', md: '36pt' },
                                            wordBreak: 'break-all',
                                            textAlign: 'center',
                                            px: { xs: 1, sm: 2 }
                                        }}
                                        fontWeight={'bold'}
                                    >
                                        {preCertificate.id}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid size={12}>
                                    <Typography variant="h5" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                        Detalhes do Produto
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CertificateItem
                                        label="Nome"
                                        value={product.name}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                🍌️
                                            </Typography>
                                        )}
                                    />
                                    {product.description &&
                                        <CertificateItem
                                            label="Descrição"
                                            value={product.description}
                                            icon={(
                                                <Typography fontSize={'24pt'}>
                                                    📝
                                                </Typography>
                                            )}
                                        />
                                    }
                                    <CertificateItem
                                        label="Categoria"
                                        value={product.category}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                📦
                                            </Typography>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CertificateItem
                                        label="Quantidade"
                                        value={`${product.quantity.value} ${product.quantity.unit}`}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                ⚖️
                                            </Typography>
                                        )}
                                    />
                                    <CertificateItem
                                        label="Origem"
                                        value={`${product.origin.city ? product.origin.city + ', ' : ''}${product.origin.state ? product.origin.state + ', ' : ''}${product.origin.country}`}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                📍
                                            </Typography>
                                        )}
                                    />
                                    {product.lot_number &&
                                        <CertificateItem
                                            label="Número do Lote"
                                            value={product.lot_number}
                                            icon={(
                                                <Typography fontSize={'24pt'}>
                                                    🏷️
                                                </Typography>
                                            )}
                                        />
                                    }
                                </Grid>
                                <Grid size={12} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} alignItems={'center'} justifyContent={'space-evenly'}>
                                    {product.carbon_emission &&
                                        <CertificateItem
                                            label="Emissão de Carbono"
                                            value={`${product.carbon_emission} kg CO2e`}
                                            icon={(
                                                <Typography fontSize={'24pt'}>
                                                    🌍
                                                </Typography>
                                            )}
                                        />
                                    }
                                    {product.tags && product.tags.length > 0 &&
                                        <CertificateItem
                                            label="Tags"
                                            value={product.tags.join(', ')}
                                            icon={(
                                                <Typography fontSize={'24pt'}>
                                                    🏷️
                                                </Typography>
                                            )}
                                        />
                                    }
                                    {
                                        product.metadata && Object.keys(product.metadata).length > 0 &&
                                        Object.entries(product.metadata).map(([key, value]) => (
                                            <CertificateItem
                                                key={key}
                                                label={NormalizeMetadataLabels(key)}
                                                value={String(value)}
                                                icon={(
                                                    <Typography fontSize={'24pt'}>
                                                        ℹ️
                                                    </Typography>
                                                )}
                                            />
                                        ))
                                    }
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="h5" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                        Detalhes do Produtor
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CertificateItem
                                        label="Nome"
                                        value={producer.name}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                👨‍🌾
                                            </Typography>
                                        )}
                                    />
                                    <CertificateItem
                                        label="Documento"
                                        value={`${producer.document.document_type}: ${producer.document.number}`}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                🆔
                                            </Typography>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CertificateItem
                                        label="Endereço"
                                        value={`${producer.address.city ? producer.address.city + ', ' : ''}${producer.address.state ? producer.address.state + ', ' : ''}${producer.address.country}`}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                🏠
                                            </Typography>
                                        )}
                                    />
                                    <CertificateItem
                                        label="Contato"
                                        value={`${producer.contact.email ? 'Email: ' + producer.contact.email + ' | ' : ''}${producer.contact.phone ? 'Phone: ' + producer.contact.phone + ' | ' : ''}${producer.contact.website ? 'Website: ' + producer.contact.website : ''}`}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                📞
                                            </Typography>
                                        )}
                                    />
                                </Grid>
                                <Grid size={12} display={'flex'} flexDirection={{ xs: 'column', md: 'row' }} alignItems={'center'} justifyContent={'space-evenly'}>
                                    {producer.car_code &&
                                        <CertificateItem
                                            label="Código CAR"
                                            value={producer.car_code}
                                            icon={(
                                                <Typography fontSize={'24pt'}>
                                                    🌳
                                                </Typography>
                                            )}
                                        />
                                    }
                                    {producer.metadata && Object.keys(producer.metadata).length > 0 &&
                                        Object.entries(producer.metadata).map(([key, value]) => (
                                            <CertificateItem
                                                key={key}
                                                label={NormalizeMetadataLabels(key)}
                                                value={String(value)}
                                                icon={(
                                                    <Typography fontSize={'24pt'}>
                                                        ℹ️
                                                    </Typography>
                                                )}
                                            />
                                        ))
                                    }
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="h5" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                        Detalhes da Certificadora
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CertificateItem
                                        label="Nome"
                                        value={certifier.name}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                🏢
                                            </Typography>
                                        )}
                                    />
                                    <CertificateItem
                                        label="Documento"
                                        value={`${certifier.document.document_type}: ${certifier.document.number}`}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                🆔
                                            </Typography>
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <CertificateItem
                                        label={`${certifier.auditors.length === 1 ? 'Auditor' : 'Auditores'}`}
                                        value={certifier.auditors.map(a => a.name).join(', ')}
                                        icon={(
                                            <Typography fontSize={'24pt'}>
                                                👮
                                            </Typography>
                                        )}
                                    />
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="h5" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                        Normas Cumpridas
                                    </Typography>
                                </Grid>
                                <Grid size={12} display={'flex'} flexWrap={'wrap'} justifyContent={{ xs: 'center', md: 'space-around' }}>
                                    {preCertificate.norms_complied && preCertificate.norms_complied.length > 0 ? (
                                        preCertificate.norms_complied.map((norm) => (
                                            <NormBadge key={norm} norm={norm} />
                                        ))
                                    ) : (
                                        <Typography>Nenhuma norma cumprida.</Typography>
                                    )}
                                </Grid>
                                <Grid size={12}>
                                    <Typography variant="h5" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                        Critérios de Sustentabilidade
                                    </Typography>
                                </Grid>
                                <Grid size={12} display={'flex'} flexWrap={'wrap'} justifyContent={{ xs: 'center', md: 'space-around' }}>
                                    {preCertificate.sustainability_criteria && preCertificate.sustainability_criteria.length > 0 ? (
                                        preCertificate.sustainability_criteria.map((criterion) => (
                                            <SustainabilityCriterionBadge key={criterion} criterion={criterion} />
                                        ))
                                    ) : (
                                        <Typography>Nenhum critério de sustentabilidade.</Typography>
                                    )}
                                </Grid>
                                {preCertificate.notes &&
                                    <>
                                        <Grid size={12}>
                                            <Typography variant="h5" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                                                Notas Adicionais
                                            </Typography>
                                        </Grid>
                                        <Grid size={12}>
                                            <Box
                                                sx={{ border: '1px solid #ccc', borderRadius: 2, padding: 2, minHeight: '100px' }}
                                            >
                                                <Typography fontSize={18}>
                                                    {preCertificate.notes || 'Nenhuma nota adicional.'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </>
                                }
                                {preCertificate.authenticity_proof && preCertificate.authenticity_proof.serial_code &&
                                    <>
                                        <Grid size={12} display={"flex"} justifyContent={"end"} alignItems={"center"} mt={2}>
                                            <Typography>
                                                {preCertificate.authenticity_proof.serial_code}
                                            </Typography>
                                        </Grid>
                                    </>
                                }

                            </Grid>
                        </Box>
                    </span>
                    {!isIssued && (<>
                        <Divider sx={{ marginY: 2 }} />
                        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={handleOpenConfirmationModal}
                                sx={{
                                    fontFamily: 'bungee',
                                    fontSize: { xs: '1rem', sm: '1.5rem', md: '24pt' },
                                    padding: { xs: '10px 20px', sm: '15px 30px' }
                                }}
                            >
                                <Icon sx={{ marginRight: { xs: 2, sm: 5 } }}>check</Icon>
                                Emitir Certificado
                            </Button>
                        </Box>
                    </>)}
                </Paper>
                <Dialog
                    open={showConfirmationModal}
                    onClose={handleCloseConfirmationModal}
                    fullWidth
                    maxWidth="sm"
                >
                    <Paper sx={{ padding: { xs: 2, sm: 4 }, minWidth: { xs: 'auto', sm: 400 } }}>
                        <Typography variant="h3" gutterBottom fontFamily={'bungee'} sx={{ fontSize: { xs: '1.5rem', sm: '2rem', md: '3rem' } }}>
                            Confirmação de Emissão
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: 18 } }} mb={4}>
                            Ao clicar em "Confirmar e Emitir", você estará assinando digitalmente o pré-certificado com sua carteira Ethereum conectada (MetaMask) e emitindo o certificado oficial.
                        </Typography>
                        <Typography sx={{ fontSize: { xs: '0.875rem', sm: '1rem', md: 18 } }} mb={4}>
                            Essa ação é irreversível e registrará o certificado na blockchain, garantindo sua autenticidade e rastreabilidade.
                        </Typography>
                        <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} justifyContent="flex-end" gap={2}>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleCloseConfirmationModal}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={async () => {
                                    await handleConfirmAndIssue();
                                    handleCloseConfirmationModal();
                                }
                                }
                            >
                                Confirmar e Emitir
                            </Button>
                        </Box>
                    </Paper>
                </Dialog>
            </Container>
        </ThemeProvider>
    )
}

export default IssueCertificate;
