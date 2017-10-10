FROM node:6-slim

# Install packages.
# Not happy with python and gcc!
RUN apt-get update \
    && apt-get install -y --no-install-recommends bzip2 python make g++\
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
RUN groupadd -r slides && useradd -r -g slides slides

# Switch to the reveal.js directory.
RUN mkdir -p /revealjs/slides
WORKDIR /revealjs

# Copy package.json
COPY package.json /revealjs/

# Prepare the reveal.js installation.
RUN npm install -g grunt-cli && npm install

# Copy revela.js code
COPY . /revealjs/

# setup user
RUN chown -R slides /revealjs
USER slides

EXPOSE 8000 35729

CMD ["grunt", "serve"]

ARG VCS_REF
ARG BUILD_DATE
LABEL org.label-schema.docker.dockerfile="/Dockerfile" \
      org.label-schema.vcs-type="git" \
      org.label-schema.vcs-url="https://github.com/FreakyBytes/reveal.js" \
      org.label-schema.build-date=$BUILD_DATE \
      org.label-schema.vcs-ref=$VCS_REF \
      org.label-schema.schema-version="1.0.0-rc1"
