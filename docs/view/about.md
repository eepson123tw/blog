---
layout: doc
---

# THREE

  <div class="container">
    <canvas id="bg"></canvas>
  </div>


<script setup lang="ts">
import * as THREE from 'three'
import gsap from 'gsap'
import { onMounted } from 'vue'
const OrbitControls = require('three-orbit-controls')(THREE);

onMounted(() => {
  //scene
  const scene = new THREE.Scene()
  //Create our sphere
  const geometry = new THREE.SphereGeometry(3, 64, 64)
  const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
    roughness: 0.5,
  })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  // light
  const light = new THREE.PointLight(0xffffff, 1, 100)
  light.position.set(0, 10, 10)
  light.intensity = 1.25
  scene.add(light)
  //camera
  const camera = new THREE.PerspectiveCamera(
    45,
    860 /500,
    0.1,
    100
  )
  camera.position.z = 20
  scene.add(camera)

  // renderer
  const canvas: HTMLCanvasElement = document.querySelector(
    '#bg'
  ) as HTMLCanvasElement
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
  })
  // 與滑鼠事件建立連線
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.enablePan = false
  controls.enableZoom = false
  controls.autoRotate = true
  controls.autoRotateSpeed = 5

  renderer.setSize(860,500)
  renderer.setPixelRatio(2)
  renderer.render(scene, camera)

  function animate() {
    requestAnimationFrame(animate)
    // mesh.rotation.x += 0.01
    // light.position.y += 0.01
    // light.position.z += 0.01
    controls.update()
    renderer.render(scene, camera)
  }
  animate()

  window.addEventListener('resize', () => {
    camera.updateProjectionMatrix()
    camera.aspect = 860 /500
    renderer.setSize(860,500)
  })

  // timeline

  const t1 = gsap.timeline({ defaults: { duration: 1 } })
  t1.fromTo(mesh.scale, { z: 0, x: 0, y: 0 }, { z: 1, x: 1, y: 1 })
  t1.fromTo('nav', { y: '-100%' }, { y: '0%' })
  t1.fromTo('.title', { opacity: 0 }, { opacity: 1 })

  // mouse color

  let mouseDown = false
  let rgb = [12, 23, 25]
  window.addEventListener('mousedown', () => {
    mouseDown = true
  })
  window.addEventListener('mouseup', () => {
    mouseDown = false
  })

  window.addEventListener('mousemove', (e) => {
    if (mouseDown) {
      rgb = [
        Math.round((e.pageX / 860) * 255),
        Math.round((e.pageY /500) * 255),
        150,
      ]
      let newColor = new THREE.Color(`rgb(${rgb.join(',')})`)
      gsap.to(mesh.material.color, {
        r: newColor.r,
        g: newColor.g,
        b: newColor.b,
      })
    }
  })
})
</script>

<style scoped>
/* canvas {
  position: fixed;
  top: 0;
  left: 0;
} */
.container {
  width:100%;
  position: relative;
}

canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

nav {
  color: white;
  z-index: 2;
  position: relative;
  padding: 4rem;
  display: flex;
  justify-content: space-between;
}
nav a {
  text-decoration: none;
  color: white;
  font-weight: bold;
}
nav ul {
  list-style: none;
  display: flex;
  gap: 4rem;
}
h1.title {
  color: white;
  z-index: 2;
  position: absolute;
  font-size: 3rem;
  left: 50%;
  top: 25%;
  transform: translate(-50%, -75%);
}
</style>
