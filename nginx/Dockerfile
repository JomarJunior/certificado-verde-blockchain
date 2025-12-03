FROM nginxinc/nginx:stable-brotli

# remove default site
RUN rm -rf /usr/share/nginx/html/*

# copy Vite build
COPY dist/ /usr/share/nginx/html/

# optional cache headers
COPY nginx.conf /etc/nginx/conf.d/default.conf