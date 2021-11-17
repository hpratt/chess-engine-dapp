FROM ubuntu:latest

ENV SOURCE_REPO https://github.com/official-stockfish/Stockfish
ENV VERSION master
ENV CXXFLAGS -std=c++17

ADD ${SOURCE_REPO}/archive/${VERSION}.tar.gz /root
WORKDIR /root

RUN apt -y update && apt -y install wget python3 python3-pip && \
    if [ ! -d Stockfish-${VERSION} ]; then tar xvzf *.tar.gz; fi && \
    cd Stockfish-${VERSION}/src && \
    apt -y install make build-essential && \
    python3 -m pip install python-chess && \
    make build ARCH=x86-64-modern && \
    make install && \
    cd ../.. && rm -rf Stockfish-${VERSION} *.tar.gz && \
    apt -y remove wget make build-essential python3-pip && \
    rm -rf /var/lib/apt/lists/*

ADD src/app.py /usr/local/bin/app.py
ENTRYPOINT [ "/usr/local/bin/app.py" ]
