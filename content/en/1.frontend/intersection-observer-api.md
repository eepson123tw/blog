---
title: Implementing Visual Reading Progress Indicators
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

> Building a visual reading progress indicator for viewport awareness

During frontend development, we often need to trigger specific page changes when visual elements enter the viewport. While third-party libraries are commonly used for this purpose, they can be quite large or unintuitive to implement. Is there a more convenient native approach?

## Intersection Observer

The Intersection Observer is a native browser API that observes the intersection ratio between page elements and the visible area, triggering callbacks when specified thresholds are met. It's commonly used for image lazy loading, infinite scroll content, and automatic video/audio playback features.

## Parameters

`IntersectionObserver(callback, options)` accepts two parameters:

- **`callback`**: The callback function to execute when the specified intersection conditions are met.
- **`options`**: Configuration object with the following properties:
  - **`root`**: The root element to observe against. When not specified or set to `null`, it defaults to the browser's viewport.
  - **`rootMargin`**: Used to modify the root element's observation area.
  - **`threshold`**: The visibility percentage of the target element. Can be a float or an array of floats, e.g., `[0, 0.25, 0.5, 0.75, 1]`. The callback is triggered whenever the target's visibility crosses any threshold value, meaning it will notify every 25% increase or decrease in visibility.

## Usage Method

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

## Practical Implementation Example

The author wanted to simulate reading website functionality, where the current reading section is highlighted in the menu list and the URL is updated accordingly.

> The implementation code uses Vue 3. You can copy the code below to observe the behavior.

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

## Reference Materials

- [MDN Intersection Observer API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
