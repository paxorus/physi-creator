/**
 * Main script, controls the scaffold and environment.
 * 
 * @author Prakhar Sahay 03/21/2017
 */

Physi.scripts.worker = "javascripts/lib/physijs_worker.js";
Physi.scripts.ammo = "ammo.js";

var selectMode = false;

var env = new Environment();
env.render();


// animation loop
var paused = true;
var frame = null;
function animate() {
	env.render();
	if (!paused) {
		env.simulate();
		Palette.update();
	}
	frame = requestAnimationFrame(animate);
}
animate();

window.onfocus = function () {
	console.log("Three started.");
	animate();
};

window.onblur = function () {
	console.log("Three paused.");
	cancelAnimationFrame(frame);
};

document.addEventListener("keydown", function (event) {
	if (event.keyCode == 13) {// enter
		paused = !paused;
		if (!paused) {
			console.log("Physi started.");
			env.resume();
		} else {
			console.log("Physi paused.");
		}
	}
	if (event.keyCode == 32) {// space
		selectMode = !selectMode;
		$("body").css("cursor", selectMode ? "pointer" : "copy");
	}
});


env.listen("click", function (event) {
	if (selectMode) {
		selectObject(event);
	} else {
		createObject(event);
	}
});

function selectObject() {
	// select and display the clicked object
	var hits = env.project(event.pageX, event.pageY);
	if (hits.length == 0) {
		return;
	}
	var clickedObject = hits[0].object;
	Palette.populate(clickedObject);
}

function createObject() {
	// create a mesh at the clicked position
	var point = env.projectOntoXY(event.pageX, event.pageY);
	if (!point) {
		return;
	}

	var mesh;
	switch ($("#geometries").val()) {
		case "box":
			mesh = Mesh.box([1, 1, 1]);
			break;
		case "sphere":
			mesh = Mesh.sphere(0.5, 0x0088FF);
			break;
		case "cylinder":
			mesh = Mesh.cylinder(0.5, 1);
			break;
		case "cone":
			mesh = Mesh.cone(0.5, 1);
			break;
		case "capsule":
			mesh = Mesh.capsule(0.5, 1);
			break;
		default:
			return;
	}

	// left, height, forward
	mesh.position.set(point.x, point.y, 0);
	env.add(mesh);
}