FROM ubuntu:latest

ENV SOURCE_REPO https://github.com/official-stockfish/Stockfish
ENV VERSION master
ENV CXXFLAGS -std=c++17
ENV DEBIAN_FRONTEND noninteractive

ADD ${SOURCE_REPO}/archive/${VERSION}.tar.gz /root
WORKDIR /root

RUN apt -y update && apt -y install wget python3 python3-pip git cmake && \
    if [ ! -d Stockfish-${VERSION} ]; then tar xvzf *.tar.gz; fi && \
    cd Stockfish-${VERSION}/src && \
    apt -y install make build-essential && \
    python3 -m pip install python-chess && \
    make build ARCH=x86-64-modern && \
    make install && \
    cd ../.. && rm -rf Stockfish-${VERSION} *.tar.gz && \
    git clone https://github.com/vshcherbyna/igel.git ./igel && cd igel && \
    git submodule update --init --recursive && \
    wget https://github.com/vshcherbyna/igel/releases/download/3.0.5/ign-1-d593efbd -O ./network_file && \
    cmake -DEVALFILE=network_file -DEVAL_NNUE=1 -DUSE_PEXT=1 -DUSE_AVX2=1 -D_BTYPE=1 -DSYZYGY_SUPPORT=TRUE . && \
    make && mv igel /bin && cd .. && rm -rf igel && \
    git clone https://github.com/Matthies/RubiChess && cd RubiChess/src && make && mv RubiChess /bin && \
    wget "https://github.com/Matthies/NN/raw/main/nn-fb50f1a2b1-20210705.nnue" -O /nn-fb50f1a2b1-20210705.nnue && \
    cd ../.. && rm -rf RubiChess && \
    apt -y remove wget make build-essential python3-pip git cmake && \
    rm -rf /var/lib/apt/lists/*

ADD src/app.py /usr/local/bin/app.py
WORKDIR /
ENTRYPOINT [ "/usr/local/bin/app.py" ]
