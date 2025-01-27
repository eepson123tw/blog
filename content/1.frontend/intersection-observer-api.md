---
title: 實作一個可視區域導讀提醒
description: Intersection Observer API
icon: 'lucide:dessert'
gitTalk: false
date: 2022-11-05 00:08:25
read: '20'
authors:
  - name: Aaron Shih
    username: eepson123tw
    avatar: https://www.github.com/eepson123tw.png
    to: https://github.com/eepson123tw
    target: _blank
---

> 實作一個可視區域導讀提醒

在前端的開發過程中，常需要在某個視覺區塊進入頁面的可視範圍時，讓頁面進行某些變化，我們會使用一些第三方的套件庫，但第三方的套件庫可能相當龐大，或是使用上來說並沒有那麼直覺，那有沒有其他更便利方法呢？

## Intersection Observer

原生的 Api，可以用來觀測頁面元素與可見區域相交部分的比例，然後可以在達到比例時觸發 callback。
常被用來在圖片的 lazyLoading，內容的無限滾動，及自動播放影片或音檔等功能。

## 參數

`IntersectionObserver(callback， options)` 接受兩個參數：

- `callback`： 當指定重疊條件發生時要執行的 callback 函式。
- `options`：
  - `root`：欲觀察的 root 元素，不特別指定或是 `null` 時等於瀏覽器的可視範圍 (browser viewport)。
  - `rootMargin`：用來改變 root 元素觀察的範圍。
  - `threshold`：Target(目標元素) 的可見程度。可帶入浮點數或浮點數的 array，ex `[0， 0.25， 0.5， 0.75， 1]`，每當 target 的可見程度高於 threshold 時，`callback` 就會被頻繁地觸發， 也就是每 25% 或者减少 25% 的时候都通知一次。可看需求變動。

## 使用方法

```javascript
const options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 0.5,
};

const observer = new IntersectionObserver(callback, options);

const target = document.querySelector('#listItem');
observer.observe(target);
```

## 實際使用案例

筆者希望能夠模擬出閱讀網站的功能，即在當前閱讀區域時，可以在 menu list 標記閱讀區塊及變動 URL。

> `實現程式碼使用 vue3，可貼上下方程式碼，觀看變化`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
  <title>Document</title>
  <style >
    *{
      margin: 0;
      padding: 0;
      list-style: none;
      box-sizing: border-box
    }
    body{
      display: flex;
      justify-content: center;
      align-items: center;
      background: #aaa;
    }
    .container{
      height: 2500px;
    }
    h1{
      font-size: 5rem;
    }
    p{
      font-size: 1rem;
      line-height: 2;
    }
    .menu{
      position: fixed;
      top: 0;
      right:0;
      width: 200px;
      height: 200px;
      background: #fff;
    }
    .menu ul{
      display: flex;
      flex-direction: column;
      background: #aaa;
      height: 100%;
    }
    .menu ul li{
      flex-grow: 1;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background:#ccc;
      color: #fff;
    }
    a{
      text-decoration: none;
      color: inherit;
    }
    .menu ul li.active a{
      color: red;
      font-weight: 900;
    }
  </style>
</head>
<body>
  <div class="container" id="app">
    <div class="menu">
      <ul v-if="ary.length">
        <li v-for="(item,idx) of ary" :class="`${item}`">
          <a :href="`#${item}`"> {{item}}</a>
        </li>
      </ul>
    </div>
    <div class="div title1" id="title1" >
      <h1>title1</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio aspernatur iure esse vero eveniet quam, laudantium optio facere voluptate, autem ratione nihil dolorem veritatis non unde repellendus in maiores explicabo suscipit. Omnis quisquam tempora eum doloribus repellendus deserunt architecto, corrupti est, odit accusamus repellat ipsa voluptas quis nesciunt. Quos nostrum dolor, ratione, facere quis quibusdam nemo, vitae temporibus delectus voluptate odit eius debitis earum atque minus suscipit reiciendis. Perspiciatis cupiditate corporis nam dolore tempore molestias exercitationem nesciunt optio provident fugiat suscipit libero earum ea, modi nulla, quas delectus veniam, doloremque necessitatibus inventore. Ratione mollitia sequi architecto labore dolores magni omnis tenetur provident. Debitis praesentium tempora sit rerum! Eaque eum, sunt nesciunt voluptatem magni, nihil impedit dolorum nostrum assumenda eos at corrupti velit nam omnis quaerat esse iste dolorem? Exercitationem accusantium sint harum, ab nesciunt alias velit eveniet soluta sequi, nulla, facilis aliquid expedita modi possimus sit. Explicabo eveniet voluptates quis amet voluptas deleniti dolor, nostrum fugit error labore omnis exercitationem iste impedit saepe tempore nulla earum sequi aspernatur ratione harum! Magni autem quam magnam alias fuga nemo, quibusdam aliquid? Maxime adipisci eligendi eius ab repellat, iste aliquid illo provident similique obcaecati fuga animi quibusdam, quidem in numquam molestiae minus mollitia sequi veniam placeat molestias voluptates ex totam! Maiores veritatis cumque doloribus quas dolores illo facere deleniti in, perferendis, ea, facilis porro. Dignissimos vitae, nesciunt velit nostrum iste iure labore tempore consectetur ducimus exercitationem recusandae voluptas blanditiis ut aut, accusamus pariatur voluptates rerum consequatur qui assumenda vel provident neque? Delectus reiciendis incidunt molestiae iusto ea officia itaque ipsum at doloremque hic dolorem eius atque sunt, corporis, magni deleniti sint odit optio fuga. Ratione expedita eligendi magni voluptate alias delectus totam tempora veritatis, qui itaque? Tenetur ea quam quisquam deleniti itaque asperiores nesciunt, culpa nam dolorum voluptate amet ducimus exercitationem laborum, temporibus optio! Minima reprehenderit ipsum sit quisquam, ipsam est voluptates recusandae adipisci, a voluptas perspiciatis officiis, quibusdam eos? Dicta facere modi voluptatem inventore? Odit a repellendus corrupti atque porro nostrum perferendis possimus, repudiandae quas incidunt enim maiores ea distinctio ad est quaerat. Explicabo suscipit laborum, ea amet in id quis consequatur odio quo perferendis nihil quia necessitatibus nostrum quam vero laudantium iusto tempora voluptate nulla. Corrupti perferendis culpa, similique praesentium saepe sint porro! Vero unde illum tempore dolore, eaque saepe voluptate repellat similique commodi eos doloremque nulla quos itaque tenetur enim, error culpa fuga quisquam laborum? Earum, corporis, libero quo voluptatibus voluptatem odio dignissimos aliquid nam ea esse vel eveniet, similique recusandae. Nesciunt quasi tenetur aperiam laboriosam consectetur aut quae soluta reprehenderit deserunt, dolore ratione ipsum fugiat! Accusamus a vel delectus repellat laudantium dignissimos reprehenderit eveniet, ipsum dolorem placeat labore tenetur accusantium tempora beatae aperiam commodi eligendi inventore velit. Esse repellendus deleniti rerum praesentium! Soluta ipsam dolore quod suscipit corrupti cum doloribus iure voluptatem alias accusamus molestias maiores sint excepturi magni magnam labore, accusantium adipisci aspernatur, quidem dolores perspiciatis saepe repellendus rem? Repudiandae, maiores culpa sequi voluptates distinctio quae explicabo mollitia ea repellat, cum ipsam adipisci aliquam accusantium perferendis nobis beatae.</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem eveniet architecto rerum amet corrupti velit tempore odit placeat, impedit, nisi eligendi? At excepturi reiciendis ab tempore voluptas voluptatum aperiam nisi.</p>
    </div>
    <div class="div title2" id="title2">
      <h1>title2</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio aspernatur iure esse vero eveniet quam, laudantium optio facere voluptate, autem ratione nihil dolorem veritatis non unde repellendus in maiores explicabo suscipit. Omnis quisquam tempora eum doloribus repellendus deserunt architecto, corrupti est, odit accusamus repellat ipsa voluptas quis nesciunt. Quos nostrum dolor, ratione, facere quis quibusdam nemo, vitae temporibus delectus voluptate odit eius debitis earum atque minus suscipit reiciendis. Perspiciatis cupiditate corporis nam dolore tempore molestias exercitationem nesciunt optio provident fugiat suscipit libero earum ea, modi nulla, quas delectus veniam, doloremque necessitatibus inventore. Ratione mollitia sequi architecto labore dolores magni omnis tenetur provident. Debitis praesentium tempora sit rerum! Eaque eum, sunt nesciunt voluptatem magni, nihil impedit dolorum nostrum assumenda eos at corrupti velit nam omnis quaerat esse iste dolorem? Exercitationem accusantium sint harum, ab nesciunt alias velit eveniet soluta sequi, nulla, facilis aliquid expedita modi possimus sit. Explicabo eveniet voluptates quis amet voluptas deleniti dolor, nostrum fugit error labore omnis exercitationem iste impedit saepe tempore nulla earum sequi aspernatur ratione harum! Magni autem quam magnam alias fuga nemo, quibusdam aliquid? Maxime adipisci eligendi eius ab repellat, iste aliquid illo provident similique obcaecati fuga animi quibusdam, quidem in numquam molestiae minus mollitia sequi veniam placeat molestias voluptates ex totam! Maiores veritatis cumque doloribus quas dolores illo facere deleniti in, perferendis, ea, facilis porro. Dignissimos vitae, nesciunt velit nostrum iste iure labore tempore consectetur ducimus exercitationem recusandae voluptas blanditiis ut aut, accusamus pariatur voluptates rerum consequatur qui assumenda vel provident neque? Delectus reiciendis incidunt molestiae iusto ea officia itaque ipsum at doloremque hic dolorem eius atque sunt, corporis, magni deleniti sint odit optio fuga. Ratione expedita eligendi magni voluptate alias delectus totam tempora veritatis, qui itaque? Tenetur ea quam quisquam deleniti itaque asperiores nesciunt, culpa nam dolorum voluptate amet ducimus exercitationem laborum, temporibus optio! Minima reprehenderit ipsum sit quisquam, ipsam est voluptates recusandae adipisci, a voluptas perspiciatis officiis, quibusdam eos? Dicta facere modi voluptatem inventore? Odit a repellendus corrupti atque porro nostrum perferendis possimus, repudiandae quas incidunt enim maiores ea distinctio ad est quaerat. Explicabo suscipit laborum, ea amet in id quis consequatur odio quo perferendis nihil quia necessitatibus nostrum quam vero laudantium iusto tempora voluptate nulla. Corrupti perferendis culpa, similique praesentium saepe sint porro! Vero unde illum tempore dolore, eaque saepe voluptate repellat similique commodi eos doloremque nulla quos itaque tenetur enim, error culpa fuga quisquam laborum? Earum, corporis, libero quo voluptatibus voluptatem odio dignissimos aliquid nam ea esse vel eveniet, similique recusandae. Nesciunt quasi tenetur aperiam laboriosam consectetur aut quae soluta reprehenderit deserunt, dolore ratione ipsum fugiat! Accusamus a vel delectus repellat laudantium dignissimos reprehenderit eveniet, ipsum dolorem placeat labore tenetur accusantium tempora beatae aperiam commodi eligendi inventore velit. Esse repellendus deleniti rerum praesentium! Soluta ipsam dolore quod suscipit corrupti cum doloribus iure voluptatem alias accusamus molestias maiores sint excepturi magni magnam labore, accusantium adipisci aspernatur, quidem dolores perspiciatis saepe repellendus rem? Repudiandae, maiores culpa sequi voluptates distinctio quae explicabo mollitia ea repellat, cum ipsam adipisci aliquam accusantium perferendis nobis beatae.</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem eveniet architecto rerum amet corrupti velit tempore odit placeat, impedit, nisi eligendi? At excepturi reiciendis ab tempore voluptas voluptatum aperiam nisi.</p>
    </div>
    <div class="div title3" id="title3" >
      <h1>title3</h1>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut nemo inventore quaerat consequuntur culpa qui accusantium explicabo quod voluptatum ab, quidem rem ipsa? Tempora, pariatur vitae neque voluptatum eum sed iusto maiores fugiat repellendus incidunt iste explicabo obcaecati eveniet quibusdam non a sint voluptas, illum vero exercitationem sunt nihil voluptate? Hic, quo nesciunt. Vel exercitationem ipsam error eligendi nisi voluptate earum nesciunt ullam fuga. Ipsum exercitationem culpa, laborum repellat nulla iusto vitae rerum eligendi. Fugit sunt, tenetur itaque reiciendis non magnam officiis odit voluptatum culpa fuga, velit ab! Quaerat totam sapiente laborum quae eius tempora obcaecati qui aliquid animi. Expedita adipisci aperiam deleniti deserunt repudiandae velit ipsa temporibus dolorum minus? Inventore, quo dolorem possimus reiciendis repellendus veniam praesentium provident ratione eos officia corrupti architecto, sequi cum at obcaecati fuga repudiandae? Necessitatibus, veritatis recusandae hic eos ducimus cumque tenetur odio, doloribus sapiente quam similique tempora at voluptate nesciunt quisquam dolore sit saepe molestias dolores illum placeat sunt. Eos, doloribus? Soluta explicabo similique vitae tempore blanditiis voluptatem dicta? Eius repellendus id sit accusamus saepe rem debitis modi vel dolores autem ut voluptatum a sequi aliquam, ad eos eum libero iure minus quam sint. Necessitatibus eum id commodi quae? Incidunt rem atque dolores eligendi voluptatibus aliquam aspernatur numquam. Nobis, iusto illo! Repellendus, a sapiente vitae voluptatum iusto corporis perspiciatis earum cupiditate optio, blanditiis est voluptates ducimus inventore ullam amet id minus neque sit harum corrupti aspernatur. Commodi mollitia aperiam aspernatur magni, aliquam quas quia voluptas accusantium repellendus obcaecati cumque quibusdam voluptatem labore ab non eum rem! Nostrum, accusantium delectus rerum explicabo ipsa obcaecati nobis commodi animi est repellendus culpa eos eum aliquam sit quod nesciunt maxime excepturi ducimus deserunt! Eligendi, nostrum. Iste repudiandae incidunt corrupti atque. Nemo impedit porro mollitia corrupti aut nihil repellendus quibusdam libero. Numquam explicabo veritatis libero aut ex aliquam consequatur adipisci sint vitae architecto velit quidem iste saepe consequuntur quisquam cum, magnam deleniti amet sed error facilis vero magni alias. Sit, minus provident quia harum iure officia porro nemo doloremque voluptatum. Culpa laudantium consectetur fuga, temporibus iste ipsa accusantium pariatur molestias harum! Ullam dignissimos corrupti ipsam vero reiciendis iure dicta sed aliquid officia eos adipisci soluta quibusdam in deleniti similique aperiam deserunt, quis provident itaque quia sint? Vel odit sit, quasi molestiae quaerat unde nihil maxime harum, doloribus libero assumenda, facere illo corrupti. Error dicta repellat, rerum ratione atque, impedit quia nobis nisi ipsa veniam dolore minus porro libero eos fugiat laudantium at perspiciatis architecto! Sunt modi, optio nulla dignissimos in provident repudiandae libero. Voluptatibus tempora consequuntur alias necessitatibus quisquam culpa porro sequi, odio quam voluptates commodi deleniti impedit fuga, corporis explicabo totam minima ad eligendi ipsa laborum exercitationem dolorem libero aliquam. Quibusdam natus nulla facere saepe! Sunt, eius voluptatum. Placeat, neque exercitationem commodi nulla quis cum facere recusandae ipsa esse ad accusamus distinctio, officia, odio aperiam. Suscipit velit aliquam officia iure, non rerum numquam laborum error quas neque enim cum illum accusantium facilis tempora, eum ipsam porro quidem similique, recusandae unde illo culpa nisi. Pariatur, voluptates? Sapiente, nam?</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Odio aspernatur iure esse vero eveniet quam, laudantium optio facere voluptate, autem ratione nihil dolorem veritatis non unde repellendus in maiores explicabo suscipit. Omnis quisquam tempora eum doloribus repellendus deserunt architecto, corrupti est, odit accusamus repellat ipsa voluptas quis nesciunt. Quos nostrum dolor, ratione, facere quis quibusdam nemo, vitae temporibus delectus voluptate odit eius debitis earum atque minus suscipit reiciendis. Perspiciatis cupiditate corporis nam dolore tempore molestias exercitationem nesciunt optio provident fugiat suscipit libero earum ea, modi nulla, quas delectus veniam, doloremque necessitatibus inventore. Ratione mollitia sequi architecto labore dolores magni omnis tenetur provident. Debitis praesentium tempora sit rerum! Eaque eum, sunt nesciunt voluptatem magni, nihil impedit dolorum nostrum assumenda eos at corrupti velit nam omnis quaerat esse iste dolorem? Exercitationem accusantium sint harum, ab nesciunt alias velit eveniet soluta sequi, nulla, facilis aliquid expedita modi possimus sit. Explicabo eveniet voluptates quis amet voluptas deleniti dolor, nostrum fugit error labore omnis exercitationem iste impedit saepe tempore nulla earum sequi aspernatur ratione harum! Magni autem quam magnam alias fuga nemo, quibusdam aliquid? Maxime adipisci eligendi eius ab repellat, iste aliquid illo provident similique obcaecati fuga animi quibusdam, quidem in numquam molestiae minus mollitia sequi veniam placeat molestias voluptates ex totam! Maiores veritatis cumque doloribus quas dolores illo facere deleniti in, perferendis, ea, facilis porro. Dignissimos vitae, nesciunt velit nostrum iste iure labore tempore consectetur ducimus exercitationem recusandae voluptas blanditiis ut aut, accusamus pariatur voluptates rerum consequatur qui assumenda vel provident neque? Delectus reiciendis incidunt molestiae iusto ea officia itaque ipsum at doloremque hic dolorem eius atque sunt, corporis, magni deleniti sint odit optio fuga. Ratione expedita eligendi magni voluptate alias delectus totam tempora veritatis, qui itaque? Tenetur ea quam quisquam deleniti itaque asperiores nesciunt, culpa nam dolorum voluptate amet ducimus exercitationem laborum, temporibus optio! Minima reprehenderit ipsum sit quisquam, ipsam est voluptates recusandae adipisci, a voluptas perspiciatis officiis, quibusdam eos? Dicta facere modi voluptatem inventore? Odit a repellendus corrupti atque porro nostrum perferendis possimus, repudiandae quas incidunt enim maiores ea distinctio ad est quaerat. Explicabo suscipit laborum, ea amet in id quis consequatur odio quo perferendis nihil quia necessitatibus nostrum quam vero laudantium iusto tempora voluptate nulla. Corrupti perferendis culpa, similique praesentium saepe sint porro! Vero unde illum tempore dolore, eaque saepe voluptate repellat similique commodi eos doloremque nulla quos itaque tenetur enim, error culpa fuga quisquam laborum? Earum, corporis, libero quo voluptatibus voluptatem odio dignissimos aliquid nam ea esse vel eveniet, similique recusandae. Nesciunt quasi tenetur aperiam laboriosam consectetur aut quae soluta reprehenderit deserunt, dolore ratione ipsum fugiat! Accusamus a vel delectus repellat laudantium dignissimos reprehenderit eveniet, ipsum dolorem placeat labore tenetur accusantium tempora beatae aperiam commodi eligendi inventore velit. Esse repellendus deleniti rerum praesentium! Soluta ipsam dolore quod suscipit corrupti cum doloribus iure voluptatem alias accusamus molestias maiores sint excepturi magni magnam labore, accusantium adipisci aspernatur, quidem dolores perspiciatis saepe repellendus rem? Repudiandae, maiores culpa sequi voluptates distinctio quae explicabo mollitia ea repellat, cum ipsam adipisci aliquam accusantium perferendis nobis beatae.</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quidem eveniet architecto rerum amet corrupti velit tempore odit placeat, impedit, nisi eligendi? At excepturi reiciendis ab tempore voluptas voluptatum aperiam nisi.</p>
    </div>
  </div>

  <script>
    const { createApp } = Vue

    createApp({
      data() {
        return {
          ary:[]
        }
      },
      mounted() {
        let h1Ary = [...document.querySelectorAll('h1')].map((d)=>d.innerText)
        this.ary = h1Ary;

        const observerOptions = {
          root: null,
          rootMargin: "0px",
          threshold: [0.0, 0.75]
        };

        adObserver = new IntersectionObserver(intersectionCallback,
                          observerOptions);

        function intersectionCallback(entries) {
          entries.forEach((entry) => {
            let e = entry.target.classList[1]
            let li = document.querySelector(`li.${e}`)
            if (entry.isIntersecting) {
              if (entry.intersectionRatio >=0.75) {
                li.classList.add('active')
                li.querySelector('a').click()
              }else{
                li.classList.remove('active')
              }
            }
          });
        }

        setTimeout(()=>{
        h1Ary.forEach((d)=>{
          let x= document.querySelector(`div.${d}`)
          adObserver.observe(x)
        })
        },500)
      },

    }).mount('#app')
  </script>
</body>
</html>

```

參考資料
[MDN Intersection Observer](https://developer.mozilla.org/zh-CN/docs/Web/API/Intersection_Observer_API)
