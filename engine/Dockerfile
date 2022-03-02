FROM ghcr.io/hpratt/tensorflow-alpine/tensorflow-alpine:t1.7.0-0.0.5

ENV SOURCE_REPO https://github.com/official-stockfish/Stockfish
ENV VERSION master
ENV CXXFLAGS -std=c++17 -DUSE_IPO=off -U_FORTIFY_SOURCE
ENV DEBIAN_FRONTEND noninteractive

ADD ${SOURCE_REPO}/archive/${VERSION}.tar.gz /root
WORKDIR /root

RUN apk add --no-cache wget python3 py3-pip build-base git cmake python3-dev

RUN if [ ! -d Stockfish-${VERSION} ]; then tar xvzf *.tar.gz; fi && \
    cd Stockfish-${VERSION}/src && \
    python3 -m pip install python-chess && \
    export CFLAGS="$CFLAGS -march=znver3 -mtune=znver3" && \
    export CXXFLAGS="$CXXFLAGS -march=znver3 -mtune=znver3" && \
    make build ARCH=x86-64-modern && \
    make install && \
    cd ../.. && rm -rf Stockfish-${VERSION} *.tar.gz
RUN git clone https://github.com/vshcherbyna/igel.git ./igel && cd igel && \
    git submodule update --init --recursive && \
    wget https://github.com/vshcherbyna/igel/releases/download/3.0.5/ign-1-d593efbd -O ./network_file && \
    cmake -DEVALFILE=network_file -DEVAL_NNUE=1 -DUSE_PEXT=1 -DUSE_AVX2=1 -D_BTYPE=1 -DSYZYGY_SUPPORT=TRUE . && \
    make && mv igel /bin && cd .. && rm -rf igel && \
    git clone https://github.com/Matthies/RubiChess && cd RubiChess/src && make && mv RubiChess /bin && \
    wget "https://github.com/Matthies/NN/raw/main/nn-d458c5999d-20220222.nnue" -O /nn-d458c5999d-20220222.nnue && \
    cd ../.. && rm -rf RubiChess && \
    apk del --purge wget make build-base py3-pip git cmake

ADD src/app.py /app/app.py
ADD sunnfish/ /usr/lib/python3.9/site-packages/sunnfish
RUN ln -s /usr/lib/python3.9/site-packages/sunnfish /sunnfish
RUN ln -s /app/app.py /usr/local/bin/app.py
# RUN apk add hdf5-dev py3-pip && python3 -m pip install 'h5py==2.10.0' --ignore-installed six
RUN find /usr/lib/python3.9/site-packages/keras/ -name "*py" -type f -exec sed -i -e "s/[\.]decode[\(][\']utf8[\'][\)]//g" {} \;
WORKDIR /
ENTRYPOINT [ "app.py" ]
