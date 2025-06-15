---
title: Nginx是甚麼?
description:  Nginx是甚麼?如何設定?
icon: 'lucide:origami'
gitTalk: false
date: 2023-04-15 23:55:24
read: '10'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---



> Nginx是甚麼?

Nginx是一款高性能的Web服務器和反向代理服務器.最初由Igor Sysoev編寫,可以作為HTTP SERVER使用,也可以作為負載均衡器、HTTP緩存和反向代理服務器使用.Nginx採事件驅動的異步架構,可以支持高併發和大規模的Web流量.

::alert{type="info"}
底層為 linux 異步非阻塞網路I/O模型.(高併發),支持gzip壓縮.
=>Web服務器,WWW服務器,HTTP服務器,web信息展示,被動式的接收到請求後,才會回應當前請求內容.

- 3萬個tcp/ip連結下,消耗內存不到150兆
::

## 企業或服務拿Nginx來幹嗎?

- 網頁展示
- 提供多個域名的網頁服務
- 提供反向代理服務
- 提供簡單資源下載服務 (FTP)
- 用戶行為分析

## Nginx的運行架構

多進程,調用多個cpu解析用戶請求.可針對進程數量去設置cpu數量.

默認使用root用戶創建master進程,透過master再創建多個worker進程.

- **master進程**

監聽 ip.port 0.0.0.0:80 被動等待用戶發來連接請求,nginx的主進程工作狀態.

用於管理資源.

- **worker進程**

1.實際處理用戶發來請求

2.master根據nginx.conf裡的配置參數有幾個worker

3.用戶請求來時,worker之間會有一個競爭狀態,勝利者可以與客戶端建立連線.

4.當worker接受到用戶請求後,如需向後反向代理給後端,會經過一層層分析後返回給用戶.

## Nginx的有用指令

```markdown

nginx -V 可以看到詳細訊息
nginx -t 檢測nginx.conf語法
nginx -s reload 重新加載nginx.conf
nginx -s stop 停止  === kill -15 nginx
nginx #直接運行nginx,前提是當前機器沒運行nginx
ps -ef|grep nginx 命令及输出字段解析
rpm -ql nginx 

```

## Nginx語法規則

- 配置文件由指令與指令塊構成；
- 每條指令以 ; 分號結尾，指令與參數間以空格符號分隔；
- 指令塊以 {} 大括號將多條指令組織在一起；
- include 語句允許組合多個配置文件以提升可維護性；
- 使用 # 符號添加注釋，提高可讀性；
- 使用 $ 符號使用變量；
- 部分指令的參數支援正則表達式；

::alert{type="warning"}

- 大多數指令都有預設值，如果沒有明確設定，將使用預設值。
- Nginx 的配置文件是順序讀取的，即後面的指令會覆蓋前面的指令。
- 指令可以使用變量，這些變量可以是預定義的變量，也可以是自定義的變量。
- 指令參數支援一些特殊字符，如 $、@、#、/、~ 等。這些字符在配置文件中有特殊的含義。
- 使用 include 指令可以將其他配置文件中的指令包含到當前配置文件中，以便提高可維護性。
- 注釋可以使用 # 或 // 符號添加。注釋可以位於行的開頭或指令的末尾，但不能位於指令的中間。
- 部分指令的參數支援正則表達式，如 location 指令中的正則表達式用於匹配 URL 路徑。正則表達式的語法和用法與其他語言中的正則表達式相同。

::

## Nginx的配置文件詳解

```yaml

#user  nobody;                         # 指定用户使用nginx
worker_processes  1;                   # nginx工作程序數量，一般與cpu核數相同

#全域設置
#error_log  logs/error.log;            # 錯誤日誌目錄
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;
#pid        logs/nginx.pid;            # nginx的pid存放目錄


#全域設置
events {
    use epoll;     # 使用epoll的I/O模型(如果你未定義Nginx如何使用，會自動分配最合適的)
    worker_connections 1024;   # 每個程序允許的最大併發數量
}
#核心HTTP部屬功能 
http {
    # 配置使用最多最頻繁的部分
    # 設置日誌
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;   # Nginx訪問日誌位置

    sendfile            on;   # 开启高效傳輸模式
    tcp_nopush          on;   # 減少網路報文數量
    tcp_nodelay         on;
    keepalive_timeout   65;   # 保持連接的時間，單位秒
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;      # 文件拓展名與類型映射表
    default_type        application/octet-stream;   # 默認文件類型

    include /etc/nginx/conf.d/*.conf;   # 加載子配置項
    
    server {

    listen       80;       # 配置監聽的端口
    charset      utf-8; #支持中文參數
    server_name  localhost;    # 配置的域名
    
    location / {

      root   /usr/share/nginx/html;  # 網站根目錄
      index  index.html index.htm;   # 默認首頁
      deny 172.168.22.11;   # 禁止訪問的ip地址，可以為all
      allow 172.168.33.44； # 允许訪問的ip地址，可以為all
      
    }
    
    error_page 500 502 503 504 /50x.html;  # 默認50x對應的訪問頁面
    error_page 400 404 error.html;   # 同上
    }

# 第二個虛擬主機
    
server { 
    }
}


```

## 使用上遇到的問題

部屬此部落格時,因為較不熟悉Nginx的部屬配置,發現reload網頁時就會發生框架啟動失敗的問題,原本以為是自己的Docker進入點寫錯,後來詢問後端朋友,表示設定並未出錯,詢問了網站部屬方的工程師後,發現只是一個location刷新空白的導頁錯誤= =,差點沒把自己氣歪XD

以下是Vue的範本,擷取至**Nginx常用的基礎配置**一文

```yaml
server {
  # 項目啟動port
  listen            80;
  # 域名（localhost）
  server_name       _;
  # 禁止 iframe 嵌套
  add_header        X-Frame-Options SAMEORIGIN;
  
  # 根路徑
  location / {
    # 項目目錄
    root /xxx;
    # 默認讀取文件
    index           index.html;
    # 配置 history 模式的刷新空白
    try_files       $uri $uri/ /index.html; =>導頁會錯誤，因匹配到前方路由時，便會停止匹配(QQ)
    try_files $uri $uri.html $uri/index.html /404.html; =>正確
  }
  
  # 後墜解决靜態資源找不到问题
  location ~* \.(gif|jpg|jpeg|png|css|js|ico)$ { 
    root           html/static/; =>記得要用時要修正成自己的目錄結構
  }
  
  # 圖片防盜
  location ~/static/.*\.(jpg|jpeg|png|gif|webp)$ {
    root              html;
    valid_referers    *.deeruby.com;
    if ($invalid_referer) {
      return          403;
    }
  }
  
  # 訪問限制
  location /static {
    root               html;
    # allow 允许
    allow              39.xxx.xxx.xxx;
    # deny  拒绝
    deny               all;
  }
}

```

## 參考資料

- [可自行配置Nginx網站設定](https://www.digitalocean.com/community/tools/nginx?domains.0.php.php=false&domains.0.routing.index=index.html&domains.0.routing.fallbackHtml=true&global.app.lang=zhTW)
- [Nginx常用的基礎配置](https://juejin.cn/post/7196859948554715195)
- [Nginx配置 try_files](https://www.jianshu.com/p/7de961138421)
- [更進一步了解Nginx](https://blog.csdn.net/crazymakercircle/article/details/128684641)
