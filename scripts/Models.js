class Pillar {
	constructor(loader, scene, x3) {
		loader.load('./assets/models/pillar/square_pillar_a.glb', (obj) => {
			scene.add(obj.scene)
			x3.add(scene, {
				label: 'Pilar'
			})
		})
	}
}


class Table {
	constructor(THREE, loader, scene, x3) {
		loader.load('./assets/models/table/table.glb', (obj) => {
			const model = obj.scene

			// Acesse o material do modelo
			model.traverse(function (child) {
				if (child.isMesh) {
					const material = child.material

					// Adicione as texturas ao material
					material.map = new THREE.TextureLoader().load('../assets/textures/wood027/Wood_027_basecolor.jpg') // Base color
					
					material.normalMap = new THREE.TextureLoader().load('../assets/textures/wood027/Wood_027_normal.jpg') // Normal map
					
					material.roughnessMap = new THREE.TextureLoader().load('../assets/textures/wood027/Wood_027_roughness.jpg') // Roughness map
					
					material.aoMap = new THREE.TextureLoader().load('../assets/textures/wood027/Wood_027_ambientOcclusion.jpg') // Ambient occlusion map
					
					// Se necessário, defina o mapeamento de texturas e outros parâmetros
					material.needsUpdate = true
				}
			})
			
			scene.add(model)
			x3.add(model)
		})
	}
}