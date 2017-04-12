/**
 * Simplifies the Three/Physi mesh constructors.
 * 
 * @author Prakhar Sahay 04/11/2017
 */

var Mesh = {
	box: function (size, color) {
		color = color || 0x444444;
		return new Physi.BoxMesh(
			// width, height, depth
			new THREE.CubeGeometry(size[0], size[1], size[2]),
			new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9})
		);
	},

	sphere: function (radius, color) {
		color = color || 0x444444;
		return new Physi.SphereMesh(
			new THREE.SphereGeometry(radius, 10, 10),
			new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9})
		);
	},

	cylinder: function (radius, height, color) {
		color = color || 0x444444;
		return new Physi.CylinderMesh(
			new THREE.CylinderGeometry(radius, radius, height, 32),
			new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9})
		);
	},

	cone: function (radius, height, color) {
		color = color || 0x444444;
		return new Physi.ConeMesh(
			new THREE.ConeGeometry(radius, height, 32),
			new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9})
		);
	},

	capsule: function (radius, height, color) {
		color = color || 0x444444;
		var capsule = new Physi.CapsuleMesh(
			new THREE.CylinderGeometry(radius, radius, height, 32),
			new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9})
		);

		var sphere = this.sphere(radius, color);
		capsule.add(sphere);
		sphere.position.y = -height / 2;
		sphere = this.sphere(radius, color);
		capsule.add(sphere);
		sphere.position.y = height / 2;
		return capsule;
	}
};