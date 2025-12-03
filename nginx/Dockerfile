FROM nginx:alpine

# remove default site
RUN rm -rf /usr/share/nginx/html/*

# copy Vite build
COPY dist/ /usr/share/nginx/html/

# precompressed Brotli + gzip (if CI doesn’t do it)
RUN apk add brotli && \
    brotli -Z /usr/share/nginx/html/*.js && \
    brotli -Z /usr/share/nginx/html/*.css && \
    gzip -k -9 /usr/share/nginx/html/*.js && \
    gzip -k -9 /usr/share/nginx/html/*.css

# optional cache headers
COPY nginx.conf /etc/nginx/conf.d/default.conf