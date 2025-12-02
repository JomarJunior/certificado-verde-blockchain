import { ethers } from "ethers";

export async function keccak256(input: string): Promise<string> {
    return ethers.keccak256(ethers.toUtf8Bytes(input));
}

export async function hashPDF(fileBuffer: ArrayBuffer): Promise<string> {
    const hash = ethers.keccak256(new Uint8Array(fileBuffer));
    return hash;
}
