/**
 *
 *
 * @author Prakhar Sahay 04/11/2017
 */

var Palette = {
	currentMesh: null,
	populate: function (mesh) {
		this.currentMesh = mesh;
		$("#modify-wireframe").prop("checked", mesh.material.wireframe);
		$("#modify-color").get(0).jscolor.fromString(this._rgbToStr(mesh.material.color));
		$("#modify-alpha").val(mesh.material.opacity);
		// size
		this._xyzToNode($("#modify-size").children(), mesh.scale);
		// position
		this._xyzToNode($("#modify-position").children(), mesh.position);
		// rotation
		this._xyzToNode($("#modify-rotation").children(), mesh.rotation);
		$("#modify-mass").val(mesh.mass);

	},

	_rgbToStr: function (color) {
		// {r:0,g:.53333,b:1} -> rgb(0,136,255)
		return "rgb(" + color.r * 255 + "," + color.g * 255 + "," + color.b * 255 + ")";
	},

	_strToRgb: function (string) {
		// 0088FF -> {r:0,g:.53333,b:1}
		return {
			r: parseInt(string.substring(0, 2), 16) / 255,
			g: parseInt(string.substring(2, 4), 16) / 255,
			b: parseInt(string.substring(4, 6), 16) / 255
		};
	},

	_nodeToXyz: function (nodes, vector) {
		vector.x = parseInt(nodes[0].value, 10);
		vector.y = parseInt(nodes[1].value, 10);
		vector.z = parseInt(nodes[2].value, 10);
	},

	_xyzToNode: function (nodes, vector) {
		nodes[0].value = vector.x;
		nodes[1].value = vector.y;
		nodes[2].value = vector.z;
	}
};

$("#palette").mousemove(function (event) {
	event.stopPropagation();
});

$("#modify-wireframe").change(function (event) {
	Palette.currentMesh.material.wireframe = this.checked;
});

$("#modify-color").change(function (event) {
	Palette.currentMesh.material.color = Palette._strToRgb(this.value);
});

$("#modify-alpha").change(function (event) {
	Palette.currentMesh.material.opacity = this.value;
});

$("#modify-size").children().change(function (event) {
	Palette._nodeToXyz($("#modify-size").children(), Palette.currentMesh.scale);
});

$("#modify-position").children().change(function (event) {
	Palette._nodeToXyz($("#modify-position").children(), Palette.currentMesh.position);
	Palette.currentMesh.__dirtyPosition = true;
});

$("#modify-position").children().change(function (event) {
	Palette._nodeToXyz($("#modify-rotation").children(), Palette.currentMesh.rotation);
	Palette.currentMesh.__dirtyRotation = true;
});

$("#modify-mass").change(function (event) {
	Palette.currentMesh.mass = this.value;
});
