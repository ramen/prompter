FROM node:16.19.0-slim

ARG SERVICE_USER=service
ARG SERVICE_UID=1001
ARG SERVICE_GID=1001

RUN export DEBIAN_FRONTEND=noninteractive \
    && apt-get -qq update \
    && apt-get -qq install --no-install-recommends \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -g $SERVICE_GID $SERVICE_USER \
    && useradd -u $SERVICE_UID -g $SERVICE_GID -d /usr/src/app -s /usr/sbin/nologin $SERVICE_USER \
    || echo "Error creating service account: $?"

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY --chown=$SERVICE_UID:$SERVICE_GID package*.json ./
RUN chown $SERVICE_UID:$SERVICE_GID ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY --chown=$SERVICE_UID:$SERVICE_GID . .

USER $SERVICE_UID:$SERVICE_GID

EXPOSE 8080
CMD [ "npm", "start" ]
