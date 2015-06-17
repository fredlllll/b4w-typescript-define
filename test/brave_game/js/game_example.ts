/// <reference path="../../../typings/requirejs/require.d.ts"/>
/// <reference path="../../../typings/b4w/b4w.d.ts"/>


var m_app:b4w.app   = b4w.require("app");
var m_main:b4w.main  = b4w.require("main");
var m_data:b4w.data  = b4w.require("data");
var m_ctl:b4w.controls   = b4w.require("controls");
var m_cons:b4w.constraints  = b4w.require("constraints");
var m_scs:b4w.scenes   = b4w.require("scenes");
var m_cfg:b4w.config   = b4w.require("config");
var m_print:b4w.print = b4w.require("print");
var m_sfx:b4w.sfx   = b4w.require("sfx");

var m_vec3:b4w.vec3  = b4w.require("vec3");
var m_quat:b4w.quat  = b4w.require("quat");

import m_conf = require("./game_config");
import m_char = require("./character");
import m_combat = require("./combat");
import m_bonuses = require("./bonuses");
import m_interface = require("./interface");
import m_golems = require("./golems");
import m_obelisks = require("./obelisks");
import m_gems = require("./gems");
import m_env = require("./environment");

var _char_wrapper = null;

var _vec3_tmp = new Float32Array(3);
var _vec3_tmp_2 = new Float32Array(3);
var _vec3_tmp_3 = new Float32Array(3);
var _vec3_tmp_4 = new Float32Array(3);
var _quat4_tmp = new Float32Array(4);
var _quat4_tmp2 = new Float32Array(4);

export function init() {

    if(detect_mobile())
        var quality = m_cfg.P_LOW;
    else
        var quality = m_cfg.P_HIGH;

    m_app.init({
        canvas_container_id: "canvas3d",
        callback: init_cb,
        physics_enabled: true,
        quality: quality,
        console_verbose: true,
        show_fps: true,
        alpha: false
    });
}

function init_cb(canvas_elem, success) {
    if (!success) {
        m_print.log("b4w init failure");
        return;
    }

    m_app.enable_controls();

    window.onresize = on_resize;
    on_resize();
    load();
}

function on_resize() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    m_main.resize(w, h);
}

function load() {
    m_data.load("level_01.json", load_cb, null, true);
}

function load_cb(data_id) {

    m_char.init_wrapper()

    var elapsed_sensor = m_ctl.create_elapsed_sensor();

    m_bonuses.init(elapsed_sensor);
    m_golems.init(elapsed_sensor);
    m_golems.init_spawn(elapsed_sensor);
    m_obelisks.init();
    m_gems.init();

    m_char.setup_controls(elapsed_sensor);
    m_env.setup_falling_rocks(elapsed_sensor);
    m_env.setup_lava(elapsed_sensor);

    setup_camera();
    //setup_music();

    function replay_cb() {
        document.getElementById("replay").style.visibility = "hidden";
        cleanup_game(elapsed_sensor);
    }

    m_interface.register_replay_cb(replay_cb);
}

function cleanup_game(elapsed_sensor) {

    m_ctl.remove_sensor_manifold(null, "PLAYLIST");

    m_char.reset();
    m_gems.reset();
    m_bonuses.reset();
    m_golems.reset();

    m_char.setup_controls(elapsed_sensor);
    m_obelisks.init();
    m_env.setup_lava(elapsed_sensor);
    m_env.setup_falling_rocks(elapsed_sensor);

    m_interface.update_hp_bar();

    //setup_music();
}

function detect_mobile() {
    if( navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)) {
        return true;
    } else {
        return false;
    }
}

function setup_camera() {
    var camera = m_scs.get_active_camera();
    var target = m_scs.get_object_by_dupli_name("character", "camera_target");
    m_cons.append_semi_soft_cam(camera, target, m_conf.CAM_OFFSET, m_conf.CAM_SOFTNESS);
}

function setup_music() {
    var intro_spk = m_scs.get_object_by_dupli_name("enviroment",
                                                   m_conf.MUSIC_INTRO_SPEAKER);
    var end_spk = m_scs.get_object_by_dupli_name("enviroment",
                                                 m_conf.MUSIC_END_SPEAKER);

    m_sfx.play_def(intro_spk);
    m_sfx.stop(end_spk);

    var intro_duration = m_sfx.get_duration(intro_spk) * m_sfx.get_playrate(intro_spk);

    var playlist_cb = function(obj, id, pulse){
        m_ctl.remove_sensor_manifold(null, "PLAYLIST");
        if (m_char.get_wrapper().hp <= 0)
            return;
        var playlist_objs = [];
        var speakers = m_conf.MUSIC_SPEAKERS;
        for (var i = 0; i < speakers.length; i++) {
            var spk_name = speakers[i];
            var spk = m_scs.get_object_by_dupli_name("enviroment", spk_name);
            playlist_objs.push(spk);
        }
        m_sfx.apply_playlist(playlist_objs, 0, true);
    }

    m_ctl.create_sensor_manifold(null, "PLAYLIST", m_ctl.CT_SHOT,
        [m_ctl.create_timer_sensor(intro_duration)], null, playlist_cb);
}

init();
