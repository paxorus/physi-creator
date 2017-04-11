/**
 * Abstracts Three/Physi.
 * 
 * @author Prakhar Sahay 03/21/2017
 */

function Environment() {

	// boilerplate Three/Physi setup
	var scene = new Physi.Scene();

	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1e3);
	camera.position.y = 7;
	camera.position.z = 15;
	camera.rotation.x = - Math.PI / 8;

	var controls = new THREE.FirstPersonControls(camera);
	controls.movementSpeed = 10;
	controls.lookSpeed = 0.1;

	var ambient = new THREE.AmbientLight(0x444444);
	scene.add(ambient);

	var renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var listeners = [];

	this.add = function (mesh) {
		scene.add(mesh);
	};

	// pedal the Three engine
	this.render = function () {
		renderer.render(scene, camera);
	};

	// pedal the Physi engine
	this.simulate = function () {
		scene.simulate();
	};

	this.update = function () {
		controls.update(1/60);
	}

	// create a glass-like floor
	this.floor = function () {
		var floor = new Physi.BoxMesh(
			new THREE.CubeGeometry(20, 20, .5),
			new THREE.MeshBasicMaterial({color: 0xBAD4FF, transparent: true, opacity: 0.5}),
			0
		);
		floor.rotation.x = - Math.PI / 2;
		scene.add(floor);
	};

	this.addBox = function (size, position) {
		var box = new Physi.BoxMesh(
			// width, height, depth
			new THREE.CubeGeometry(size[0], size[1], size[2]),
			new THREE.MeshBasicMaterial({color: 0x444444, transparent: true, opacity: 0.9}),
			10000
		);
		// left, height, forward
		box.position.set(position[0], position[1], position[2]);
		this.add(box);
		return box;
	};

	this.addSphere = function (radius, position, color) {
		color = color || 0x444444;
		var sphere = new Physi.SphereMesh(
			new THREE.SphereGeometry(radius, 10, 10),
			new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.9})
		);
		sphere.position.set(position[0], position[1], position[2]);
		env.add(sphere);
		return sphere;
	};

	// start an event listener
	this.listen = function (eventType, eventHandler) {
		listeners.push([eventType, eventHandler]);
		renderer.domElement.addEventListener(eventType, eventHandler);
	};

	// kill all event listeners
	this.disable = function () {
		listeners.forEach(function (data) {
			renderer.domElement.removeEventListener(data[0], data[1]);
		});
	};

	this.project = function (x, y) {
		return this.castRay(x, y, this.objects());
	};

	// project a point (x, y) onto the z=0 plane based on the camera angle, returns the new (x, y)
	this.projectOntoXY = function (x, y) {
		// the plane we'll project onto, z=0
		var planeMesh = new THREE.Mesh(
			new THREE.PlaneGeometry(30, 30),
			new THREE.MeshBasicMaterial()
		);
		var hits = this.castRay(x, y, [planeMesh]);

		if (hits.length == 1) {
			return hits[0].point;
		}
		return null;
	};

	this.castRay = function (x, y, objects) {
		// essentially boilerplate
		var rend = renderer.domElement;
		var source = new THREE.Vector3(
			(x - rend.offsetLeft) / rend.width * 2 - 1,
			-(y - rend.offsetTop) / rend.height * 2 + 1,
			0.5
		);

		source.unproject(camera);
		var raycaster = new THREE.Raycaster(
			camera.position,
			source.sub(camera.position).normalize()
		);

		return raycaster.intersectObjects(objects);
	};

	// place a large, unmovable object on the screen, instantly colliding with every visible object
	this.explode = function () {
		var collider = this.addSphere(20, [0, 0, 0]);
		collider.setLinearFactor(new THREE.Vector3(0, 0, 0));
		collider.material.opacity = 0;
	};

	this.objects = function () {
		return scene.children.filter(function (x) {
			return x instanceof THREE.Mesh;
		});
	};

	this.floor();
}
