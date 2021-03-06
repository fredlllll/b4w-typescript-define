/// <reference path="../../../typings/requirejs/require.d.ts"/>
/// <reference path="../../../typings/b4w/b4w.d.ts"/>

var m_ctl:b4w.controls = b4w.require("controls");
var m_scs:b4w.scenes = b4w.require("scenes");
var m_anim:b4w.animation = b4w.require("animation");
var m_sfx:b4w.sfx = b4w.require("sfx");
var m_trans:b4w.transform = b4w.require("transform");
var m_util:b4w.util  = b4w.require("util");
var m_cons:b4w.constraints  = b4w.require("constraints");
var m_vec3:b4w.vec3  = b4w.require("vec3");

import m_conf = require("./game_config");
import m_obelisks = require("./obelisks");
import m_char = require("./character");

var _gem_wrappers = [];

export function init() {
    var gem_cb = function(gem, id, pulse, gem_wrapper) {
        if (pulse == 1) {
            m_char.add_gem(gem_wrapper);
        }
    }
    for (var i = 0; i < m_conf.GEMS_EMPTIES.length; i++) {
        var gem_empty_name = m_conf.GEMS_EMPTIES[i];
        var gem_name = m_conf.GEMS_NAMES[i];
        var gem_empty = m_scs.get_object_by_name(gem_empty_name);
        var gem = m_scs.get_object_by_dupli_name(gem_empty_name, gem_name);
        var gem_wrapper = init_gem_wrapper(gem_empty, gem, i);
        _gem_wrappers.push(gem_wrapper);

        var coll_sens_char = m_ctl.create_collision_sensor(gem, "CHARACTER");
        m_ctl.create_sensor_manifold(gem, "PICK_GEM", m_ctl.CT_TRIGGER,
            [coll_sens_char], null, gem_cb, gem_wrapper);
    }

}

function init_gem_wrapper(empty, gem, id) {
    var gem_wrapper = {
        empty: empty,
        gem: gem,
        id: id,
        state: m_conf.GM_SPARE
    }
    return gem_wrapper;
}

export function spawn(trans) {
    var num_spare = 0;
    for (var i = 0; i < _gem_wrappers.length; i++) {
        if (can_spawn(i))
            num_spare++;
    }

    if (!num_spare)
        return;

    var rand = Math.floor(num_spare * Math.random());
    for (var i = 0; i < _gem_wrappers.length; i++) {
        if (can_spawn(i) && rand-- == 0) {
            var gem_wrapper = _gem_wrappers[i];
            var gem_empty = gem_wrapper.empty;
            m_trans.set_translation_v(gem_empty, trans);
            gem_wrapper.state = m_conf.GM_LAYING;
            break;
        }
    }
}

export function reset() {
    for (var i = 0; i < _gem_wrappers.length; i++) {
        var gem_wrapper = _gem_wrappers[i];
        var gem_empty = gem_wrapper.empty;
        m_cons.remove(gem_empty)
        m_trans.set_translation_v(gem_empty, m_conf.DEFAULT_POS);
        gem_wrapper.state = m_conf.GM_SPARE;
    }
}

function can_spawn(id) {
    return _gem_wrappers[id].state == m_conf.GM_SPARE &&
           (!m_obelisks.is_filled(id) || id == 5); // multi gem
}
