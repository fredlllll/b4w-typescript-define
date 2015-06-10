/// <reference path="./typings/requirejs/require.d.ts"/>
/// <reference path="./typings/b4w/b4w.d.ts"/>


"use strict"

if (b4w.module_check("game_example_main"))
    throw "Failed to register module: game_example_main";

b4w.register("game_example_main", function(exports, require) {

var m_anim  = require("animation");
var m_app   = require("app");
var m_main  = require("main");
var m_data  = require("data");
var m_ctl   = require("controls");
var m_phy   = require("physics");
var m_cons  = require("constraints");
var m_scs   = require("scenes");
var m_trans = require("transform");
var m_cfg   = require("config");

console.log(m_anim);

var _character;
var _character_rig;

var ROT_SPEED = 1.5;
var CAMERA_OFFSET = new Float32Array([0, 1.5, -4]);

exports.init = function() {
    m_app.init({
        canvas_container_id: "canvas3d",
        callback: init_cb,
        physics_enabled: true,
        alpha: false,
        physics_uranium_path: "uranium.js"
    });
}

function init_cb(canvas_elem, success) {

    if (!success) {
        console.log("b4w init failure");
        return;
    }

    m_app.enable_controls(canvas_elem);

    window.onresize = on_resize;
    on_resize();
    load();
}

function on_resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    m_main.resize(w, h);
};

function load() {
    m_data.load("game_example.json", load_cb);
}


function load_cb(root) {

}


});

b4w.require("game_example_main").init();
