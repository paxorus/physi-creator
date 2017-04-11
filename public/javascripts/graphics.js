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
var stop = false;
function animate() {
	if (stop) {
		return;
	}
	env.simulate();
	env.render();
	env.update();
	requestAnimationFrame(animate);
}
// animate();

document.addEventListener("keydown", function (event) {
	if (event.keyCode == 13) {// enter
		animate();
	}
	if (event.keyCode == 32) {// space
		selectMode = !selectMode;
	}
});


env.listen("click", function (event) {
	// either select object or place object
	if (selectMode) {
		var hits = env.project(event.pageX, event.pageY);
		if (hits.length == 0) {
			return;
		}
		var clickedObject = hits[0].object;
		// console.log(clickedObject);
		// window.c = clickedObject;
		Palette.populate(clickedObject);
	} else {
		// find out where the user clicked, based on camera angle
		var point = env.projectOntoXY(event.pageX, event.pageY);
		if (!point) {
			return;
		}

		// create a striker ball
		env.addSphere(0.5, [point.x, point.y, 0], 0x0088FF);
		env.render();
	}
});
