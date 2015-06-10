"use strict";

/** 
 * Camera API. 
 * All functions require a valid camera object ID. Use get_object_by_name() or
 * get_active_camera() from {@link module:scenes} to retrieve it.
 * @module camera
 */
b4w.module["camera"] = function(exports, require) {

var camera      = require("__camera");
var config      = require("__config");
var m_phy       = require("__physics");
var m_print     = require("__print");
var constraints = require("__constraints");
var transform   = require("__transform");
var m_util      = require("__util");

var m_vec3 = require("vec3");
var m_vec4 = require("vec4");
var m_quat = require("quat");
var m_mat3 = require("mat3");
var m_mat4 = require("mat4");

var cfg_ctl = config.controls;

var _vec2_tmp = new Float32Array(2);
var _vec3_tmp = new Float32Array(3);
var _vec3_tmp2 = new Float32Array(3);
var _vec4_tmp = new Float32Array(4);
var _mat3_tmp = new Float32Array(9);

/**
 * Camera movement style - static.
 * @const module:camera.MS_STATIC
 */
exports.MS_STATIC = camera.MS_STATIC;
/**
 * Camera movement style - animated.
 * @const module:camera.MS_ANIMATION
 */
exports.MS_ANIMATION = camera.MS_ANIMATION;
/**
 * Camera movement style - target.
 * @const module:camera.MS_TARGET_CONTROLS
 */
exports.MS_TARGET_CONTROLS = camera.MS_TARGET_CONTROLS;
/**
 * Camera movement style - eye.
 * @const module:camera.MS_EYE_CONTROLS
 */
exports.MS_EYE_CONTROLS = camera.MS_EYE_CONTROLS;
/**
 * Camera movement style - hover.
 * @const module:camera.MS_HOVER_CONTROLS
 */
exports.MS_HOVER_CONTROLS = camera.MS_HOVER_CONTROLS;

/**
 * Check if the object is a camera.
 * @method module:camera.is_camera
 * @param {Object} obj Object ID
 * @returns {Boolean} Checking result.
 */
exports.is_camera = camera.is_camera;

/**
 * Check if the object is a camera and has MS_TARGET_CONTROLS move style
 * @method module:camera.is_target_camera
 * @param {Object} obj Object ID
 * @returns {Boolean} Checking result.
 */
exports.is_target_camera = camera.is_target_camera;

/**
 * Check if the object is a camera and has MS_EYE_CONTROLS move style
 * @method module:camera.is_eye_camera
 * @param {Object} obj Object ID
 * @returns {Boolean} Checking result.
 */
exports.is_eye_camera = camera.is_eye_camera;

/**
 * Check if the object is a camera and has MS_HOVER_CONTROLS move style
 * @method module:camera.is_hover_camera
 * @param {Object} obj Object ID
 * @returns {Boolean} Checking result.
 */
exports.is_hover_camera = camera.is_hover_camera;

/**
 * Set camera movement style (MS_*)
 * @method module:camera.set_move_style
 * @param {Object} camobj Camera object ID
 * @param {Number} move_style Camera movement style
 */
exports.set_move_style = function(camobj, move_style) {
    camobj._render.move_style = move_style;
}
/**
 * Get camera movement style
 * @method module:camera.get_move_style
 * @param {Object} camobj Camera object ID
 * @returns {Number} Camera movement style
 */
exports.get_move_style = function(camobj) {
    if (!camera.is_camera(camobj)) {
        m_print.error("get_move_style(): Wrong object");
        return null;
    }

    return camera.get_move_style(camobj);
}

/**
 * Set camera velocity params
 * @method module:camera.set_velocity_params
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} velocity Camera velocity params (velocity_trans, velocity_rot, velocity_zoom)
 */
exports.set_velocity_params = function(camobj, velocity) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_eye_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("set_velocity_params(): Wrong object or camera move style");
        return null;
    }

    var render = camobj._render;

    render.velocity_trans = velocity[0];
    render.velocity_rot = velocity[1];
    render.velocity_zoom = velocity[2];
}
/**
 * Get camera velocity params
 * @method module:camera.get_velocity_params
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [dest] Velocity params
 * @returns {Float32Array} Velocity params (velocity_trans, velocity_rot, velocity_zoom)
 */
exports.get_velocity_params = function(camobj, dest) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_eye_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("get_velocity_params(): Wrong object or camera move style");
        return null;
    }

    if (!dest) {
        dest = new Float32Array(3);
    }

    var render = camobj._render;

    dest[0] = render.velocity_trans;
    dest[1]   = render.velocity_rot;
    dest[2]  = render.velocity_zoom;

    return dest;
}

/**
 * Low-level function: set camera position based on input parameters. Perform 
 * camera vertical alignment based on the "up" parameter.
 * @method module:camera.set_look_at
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} eye Eye vector
 * @param {Float32Array} target Target vector
 * @param {Float32Array} up Up vector
 */
exports.set_look_at = function(camobj, eye, target, up) {
    var render = camobj._render;

    camera.eye_target_up_to_trans_quat(eye, target, up, render.trans, render.quat);

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
};

/**
 * Get camera eye vector.
 * @method module:camera.get_eye
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [dest] Destination eye vector
 * @returns {Float32Array} Destination eye vector
 */
exports.get_eye = function(camobj, dest) {
    if (!camera.is_camera(camobj)) {
        m_print.error("get_eye(): Wrong object");
        return;
    }
    
    if (!dest)
        var dest = new Float32Array(3);

    m_vec3.copy(camobj._render.trans, dest);
    return dest;
}

exports.set_pivot = set_pivot;
/**
 * Set pivot point for the TARGET camera.
 * @method module:camera.set_pivot
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} coords Pivot vector
 */
function set_pivot(camobj, coords) {
    if (!camera.is_target_camera(camobj)) {
        m_print.error("set_pivot(): Wrong object or camera move style");
        return;
    }

    m_vec3.copy(coords, camobj._render.pivot);
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

exports.set_trans_pivot = set_trans_pivot;
/**
 * Set translation and pivot point for the TARGET camera.
 * @method module:camera.set_trans_pivot
 * @param {Object} camobj Camera Object ID
 * @param {Float32Array} trans Translation vector
 * @param {Float32Array} pivot Pivot vector
 */
function set_trans_pivot(camobj, trans, pivot) {
    if (!camera.is_target_camera(camobj)) {
        m_print.error("set_trans_pivot(): Wrong object or camera move style");
        return;
    }

    m_vec3.copy(trans, camobj._render.trans);
    m_vec3.copy(pivot, camobj._render.pivot);
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Get the camera pivot point.
 * @method module:camera.get_pivot
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [dest] Destination pivot vector
 * @returns {Float32Array} Destination pivot vector
 */
exports.get_pivot = function(camobj, dest) {
    if (!camera.is_target_camera(camobj)) {
        m_print.error("get_pivot(): Wrong object or camera move style");
        return;
    }

    if (!dest)
        var dest = new Float32Array(3);

    var render = camobj._render;

    m_vec3.copy(render.pivot, dest);
    return dest;
}

/**
 * Rotate TARGET camera around the pivot point.
 * @method module:camera.rotate_pivot
 * @param {Object} camobj Camera object ID
 * @param {Number} delta_phi Azimuth angle in radians
 * @param {Number} delta_theta Elevation angle in radians
 * @deprecated use rotate_camera() or rotate_target_camera() instead
 */
exports.rotate_pivot = function(camobj, delta_phi, delta_theta) {
    m_print.error("rotate_pivot() deprecated, use rotate_camera() or rotate_target_camera() instead");
    exports.rotate_target_camera(camobj, delta_phi, delta_theta);
}

/**
 * Move the pivot point of the TARGET camera.
 * +h from left to right
 * +v from down to up
 * @method module:camera.move_pivot
 * @param {Object} camobj Camera object ID
 * @param {Number} trans_h_delta Delta of the horizontal translation
 * @param {Number} trans_v_delta Delta of the vertical translation
 */
exports.move_pivot = function(camobj, trans_h_delta, trans_v_delta) {

    if (!camera.is_target_camera(camobj)) {
        m_print.error("move_pivot(): wrong object");
        return;
    }

    var render = camobj._render;
    
    if (render.use_panning) {
        var mat = m_mat3.fromMat4(render.world_matrix, _mat3_tmp);

        var trans_vector = _vec3_tmp;

        var dist_vector = m_vec3.subtract(render.trans, render.pivot, _vec3_tmp2);

        trans_vector[0] = trans_h_delta;
        trans_vector[1] = 0;
        trans_vector[2] = trans_v_delta;

        m_vec3.scale(trans_vector, m_vec3.len(dist_vector), trans_vector);
        m_vec3.transformMat3(trans_vector, mat, trans_vector);
        m_vec3.add(render.pivot, trans_vector, render.pivot);
        m_vec3.add(render.trans, trans_vector, render.trans);

        transform.update_transform(camobj);
        m_phy.sync_transform(camobj);
    }
}

/**
 * Rotate HOVER camera around the hover pivot point.
 * @method module:camera.rotate_hover_cam
 * @param {Object} camobj Camera object ID
 * @param {Number} angle Horizontal angle in radians
 * @deprecated Use rotate_camera() or rotate_hover_camera() instead
 */
exports.rotate_hover_cam = function(camobj, angle) {
    m_print.error("rotate_hover_cam() deprecated, use rotate_camera() or rotate_hover_camera() instead");
    exports.rotate_hover_camera(camobj, angle, 0);
}

/**
 * Get an angle of the HOVER camera.
 * @method module:camera.get_hover_cam_angle
 * @param {Object} camobj Camera object ID
 * @returns {Number} An angle of the hover camera
 */
exports.get_hover_cam_angle = function(camobj) {
    m_print.error("get_hover_cam_angle() deprecated, use get_camera_angles() instead");
    if (!camera.is_hover_camera(camobj)) {
        m_print.error("get_hover_cam_angle(): wrong object or camera move style");
        return null;
    }

    return -camera.get_camera_angles(camobj, _vec2_tmp)[1];
}

/**
 * Set an angle of the HOVER camera.
 * @method module:camera.set_hover_cam_angle
 * @param {Object} camobj Camera object ID
 * @param {Number} angle Angle between the view and the horizontal plane
 * @deprecated Use rotate_camera() or rotate_hover_camera() instead
 */
exports.set_hover_cam_angle = function(camobj, angle) {
    m_print.error("set_hover_cam_angle() deprecated, use rotate_camera() or rotate_hover_camera() instead");

    if (!camera.is_hover_camera(camobj)) {
        m_print.error("set_hover_cam_angle(): wrong object or camera move style");
        return;
    }
    var render = camobj._render;

    if (!render.use_distance_limits) {
        m_print.error("set_hover_cam_angle(): distance/hover_angle limits are not defined or disabled");
        return;
    }

    var angles = camera.get_camera_angles(camobj, _vec2_tmp);
    // NOTE: prepare hover angle (CCW style)
    var angle_ccw = -angle;
    var rot_angle = angle_ccw - angles[1];

    if (rot_angle)
        camera.rotate_hover_camera(camobj, 0, rot_angle);

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Get hover angle limits for the HOVER camera converted into range [-PI, PI].
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.get_hover_angle_limits
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [angles] Destination vector
 * @returns {Float32Array} Array [hover_angle_limits.down, hover_angle_limits.up]
 */
exports.get_hover_angle_limits = function(camobj, angles) {
    if (!camera.is_hover_camera(camobj)) {
        m_print.error("get_hover_angle_limits(): wrong object");
        return;
    }

    if(camobj._render.hover_angle_limits) {
        if (!angles)
            angles = new Float32Array(2);

        angles[0] = camobj._render.hover_angle_limits.down;
        angles[1] = camobj._render.hover_angle_limits.up;
    } else 
        m_print.error("get_hover_angle_limits(): camera hasn't angle limits");

    return angles;
}

/**
 * Get distance limits of the TARGET/HOVER camera.
 * @method module:camera.get_cam_dist_limits
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [dist] Returning distance limits
 * @returns {Float32Array} Array [distance_max, distance_min]
 */
exports.get_cam_dist_limits = function(camobj, dist) {
    if (!camera.is_hover_camera(camobj) && !camera.is_target_camera(camobj)) {
        m_print.error("get_cam_dist_limits(): wrong object");
        return;
    }

    if (camobj._render.use_distance_limits) {
        if (!dist)
            dist = new Float32Array(2);

        dist[0] = camobj._render.distance_max;
        dist[1] = camobj._render.distance_min;
    } else 
        m_print.error("get_cam_dist_limits(): camera hasn't distance limits");
        
    return dist;
}

/**
 * Translate HOVER camera.
 * @method module:camera.translate_hover_cam_v
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} Translation vector
 * @deprecated Use hover_cam_set_translation() instead.
 */
exports.translate_hover_cam_v = function(camobj, trans) {
    m_print.error("translate_hover_cam_v() deprecated, use hover_cam_set_translation() instead");
    exports.hover_cam_set_translation(camobj, trans);
}

/**
 * Set translation of the HOVER camera.
 * @method module:camera.hover_cam_set_translation
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} Translation vector
 */
exports.hover_cam_set_translation = function(camobj, trans) {
    if (!camera.is_hover_camera(camobj)) {
        m_print.error("hover_cam_set_translation(): wrong object");
        return;
    }

    var render = camobj._render;
    if (render.use_distance_limits) {
        var trans_delta = m_vec3.subtract(trans, render.trans, _vec3_tmp);
        m_vec3.add(trans_delta, render.hover_pivot, render.hover_pivot);
    } 
    transform.set_translation(camobj, trans);
    
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);   
}

/**
 * Get pivot translation of the HOVER camera.
 * @method module:camera.get_hover_cam_pivot
 * @param {Object} camobj Camera object ID
 * @returns {Float32Array} Translation pivot
 */
exports.get_hover_cam_pivot = function(camobj, dest) {
    if (!camera.is_hover_camera(camobj)) {
        m_print.error("get_hover_cam_pivot(): wrong object");
        return null;
    }

    if (!dest)
        dest = new Float32Array(3);

    m_vec3.copy(camobj._render.hover_pivot, dest);

    return dest;
}

/**
 * Does camera have distance limits?
 * @method module:camera.has_distance_limits
 * @param {Object} camobj Camera object ID
 * @returns {Boolean} True if the camera has distance limits.
 */
exports.has_distance_limits = function(camobj) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("has_distance_limits(): wrong object");
        return null;
    }
    return camobj._render.use_distance_limits;
}

/**
 * Set vertical angle limits for the TARGET/EYE camera or vertical (Z axis)
 * translation limits for the HOVER camera.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.apply_vertical_limits
 * @param {Object} camobj Camera object ID
 * @param {Number} down_value Vertical down limit
 * @param {Number} up_value Vertical up limit
 * @param {Number} [space=transform.SPACE_WORLD] Space to make clamping relative to
 */
exports.apply_vertical_limits = function(camobj, down_value, up_value, space) {

    var ms = camera.get_move_style(camobj);
    switch (ms) {
    case camera.MS_TARGET_CONTROLS:
    case camera.MS_EYE_CONTROLS:
        space = space | transform.SPACE_WORLD;
        break;
    case camera.MS_HOVER_CONTROLS:
        if (down_value > up_value) {
            m_print.error("apply_vertical_limits(): wrong vertical limits");
            return;
        }
        break;
    default:
        m_print.error("apply_vertical_limits(): wrong object");
        return;
        break;
    }

    var render = camobj._render;
    render.vertical_limits = {
        down: down_value,
        up: up_value
    };
    camera.prepare_vertical_limits(camobj, space == transform.SPACE_LOCAL);

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Remove vertical clamping limits from the TARGET/EYE/HOVER camera.
 * @method module:camera.clear_vertical_limits
 * @param {Object} camobj Camera object ID
 */
exports.clear_vertical_limits = function(camobj) {
    var render = camobj._render;
    render.vertical_limits = null;
}

/**
 * Set horizontal angle limits for the TARGET/EYE camera or horizontal (X axis)
 * translation limits for the HOVER camera.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.apply_horizontal_limits
 * @param {Object} camobj Camera object ID
 * @param {Number} left_value Horizontal left limit
 * @param {Number} right_value Horizontal right limit
 * @param {Number} space Space to make clamping relative to
 */
exports.apply_horizontal_limits = function(camobj, left_value, right_value,
        space) {

    var ms = camera.get_move_style(camobj);
    switch (ms) {
    case camera.MS_TARGET_CONTROLS:
    case camera.MS_EYE_CONTROLS:
        break;
    case camera.MS_HOVER_CONTROLS:
        if (left_value > right_value) {
            m_print.error("apply_horizontal_limits(): wrong horizontal limits");
            return;
        }
        break;
    default:
        m_print.error("apply_horizontal_limits(): wrong object");
        return;
        break;
    }

    camobj._render.horizontal_limits = {
        left: left_value,
        right: right_value
    };
    camera.prepare_horizontal_limits(camobj, space == transform.SPACE_LOCAL);

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Remove horizontal clamping limits from the TARGET/EYE/HOVER camera.
 * @method module:camera.clear_horizontal_limits
 * @param {Object} camobj Camera object ID
 */
exports.clear_horizontal_limits = function(camobj) {
    var render = camobj._render;
    render.horizontal_limits = null;
}

/**
 * Get the horizontal angle limits for the TARGET/EYE camera converted into range [0, 2PI] or
 * horizontal translation limits for the HOVER camera.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.get_horizontal_limits
 * @param {Object} camobj Camera Object ID
 * @param {Float32Array} [dest] Destination vector for the camera angle limits: [left, right]
 * @returns {Float32Array} Destination vector for the camera angle limits: [left, right]
 */
 exports.get_horizontal_limits = function(camobj, dest) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_eye_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("get_horizontal_limits(): wrong object");
        return;
    }
    var render = camobj._render;

    dest = dest || new Float32Array(2);
    if (render.horizontal_limits) {
        dest[0] = render.horizontal_limits.left;
        dest[1] = render.horizontal_limits.right;
        return dest;
    }
    return;
 }

 /**
 * Does camera have horizontal limits?
 * @method module:camera.has_horizontal_limits
 * @param {Object} camobj Camera Object ID
 * @returns {Boolean} True if the camera has horizontal limits.
 */
exports.has_horizontal_limits = function(camobj) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_eye_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("has_horizontal_limits(): wrong object");
        return;
    }

    return Boolean(camobj._render.horizontal_limits);
 }


/**
 * Set hover angle limits for the HOVER camera.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.apply_hover_angle_limits
 * @param {Object} camobj Camera object ID
 * @param {Number} down_angle Down hover angle limit
 * @param {Number} up_angle Up hover angle limit
 */
exports.apply_hover_angle_limits = function(camobj, down_angle, up_angle) {
    if (camera.is_hover_camera(camobj)) {
        if (down_angle < up_angle) {
            m_print.error("apply_hover_angle_limits(): wrong hover angle limits");
            return;
        }

        var down_limit = m_util.angle_wrap_periodic(down_angle, -Math.PI, Math.PI);
        var up_limit = m_util.angle_wrap_periodic(up_angle, -Math.PI, Math.PI);

        down_limit = m_util.clamp(down_limit, -Math.PI / 2, 0);
        up_limit = m_util.clamp(up_limit, -Math.PI / 2, 0);

        var render = camobj._render;
        render.hover_angle_limits = {
            down: down_limit,
            up: up_limit
        };
        camera.hover_camera_update_distance(camobj);
    } else {
        m_print.error("apply_hover_angle_limits(): wrong object");
        return;
    }
    
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Remove hover angle limits from the HOVER camera.
 * @method module:camera.clear_hover_angle_limits
 * @param {Object} camobj Camera object ID
 */
exports.clear_hover_angle_limits = function(camobj) {
    if (!camera.is_hover_camera(camobj)) {
        m_print.error("clear_hover_angle_limits(): wrong object");
        return;
    }

    camobj._render.hover_angle_limits = null;
}

/**
 * Set distance limits for the TARGET camera.
 * @method module:camera.apply_distance_limits
 * @param {Object} camobj Camera object ID
 * @param {Number} min Minimum distance to target
 * @param {Number} max Maximum distance to target
 */
exports.apply_distance_limits = function(camobj, min, max) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("apply_distance_limits(): wrong object");
        return;
    }

    if (min > max) {
        m_print.error("apply_distance_limits(): wrong distance limits");
        return;
    }

    var render = camobj._render;
    render.use_distance_limits = true;
    render.distance_min = min;
    render.distance_max = max;

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Remove distance clamping limits for the TARGET camera
 * @method module:camera.clear_distance_limits
 * @param {Object} camobj Camera object ID
 */
exports.clear_distance_limits = function(camobj) {
    if (!camera.is_target_camera(camobj)
            && !camera.is_hover_camera(camobj)) {
        m_print.error("clear_distance_limits(): wrong object");
        return;
    }

    camobj._render.use_distance_limits = false;
}

/**
 * @method module:camera.set_eye_params
 * @deprecated Use rotate_camera() or rotate_eye_camera() to change camera orientation
 */
exports.set_eye_params = function(camobj, h_angle, v_angle) {
    m_print.error("set_eye_params() deprecated, use rotate_camera() or rotate_eye_camera() instead");
    exports.rotate_eye_camera(camobj, h_angle, Math.PI/2 - v_angle);
}
/**
 * Check if the camera is looking upwards
 * @method module:camera.is_look_up
 * @param {Object} camobj Camera object ID
 */
exports.is_look_up = function(camobj) {
    var quat = camobj._render.quat;

    var dir = _vec3_tmp;
    m_util.quat_to_dir(quat, m_util.AXIS_MY, dir);

    if (dir[1] >= 0)
        return true;
    else 
        return false;
}

/**
 * Rotates a camera counterclockwise (CCW) by given angles depending on the camera move style.
 * Performs delta rotation or sets camera absolute rotation depending on the "*_is_abs" parameters.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.rotate_camera
 * @param {Object} camobj Camera object ID
 * @param {Number} phi Azimuth angle in radians
 * @param {Number} theta Elevation angle in radians
 * @param {Boolean} [phi_is_abs=false] For phi angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 * @param {Boolean} [theta_is_abs=false] For theta angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 */
exports.rotate_camera = function(camobj, phi, theta, phi_is_abs, theta_is_abs) {
    var move_style = exports.get_move_style(camobj);

    switch (move_style) {
    case camera.MS_STATIC:
    case camera.MS_ANIMATION:
        break; 
    case camera.MS_TARGET_CONTROLS:
        camera.rotate_target_camera(camobj, phi, theta, phi_is_abs, theta_is_abs);
        break;
    case camera.MS_EYE_CONTROLS:
        camera.rotate_eye_camera(camobj, phi, theta, phi_is_abs, theta_is_abs);
        break;
    case camera.MS_HOVER_CONTROLS:
        camera.rotate_hover_camera(camobj, phi, theta, phi_is_abs, theta_is_abs);
        break;
    default:
        m_print.error("rotate_camera(): Wrong object");
        break;
    }

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Rotates the TARGET camera counterclockwise (CCW) around its pivot by given angles. 
 * Performs delta rotation or sets camera absolute rotation depending on the "*_is_abs" parameters.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.rotate_target_camera
 * @param {Object} camobj Camera object ID
 * @param {Number} phi Azimuth angle in radians
 * @param {Number} theta Elevation angle in radians
 * @param {Boolean} [phi_is_abs=false] For phi angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 * @param {Boolean} [theta_is_abs=false] For theta angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 */
exports.rotate_target_camera = function(camobj, phi, theta, phi_is_abs, theta_is_abs) {
    if (!camera.is_target_camera(camobj)) {
        m_print.error("rotate_target_camera(): wrong object");
        return;
    }

    camera.rotate_target_camera(camobj, phi, theta, phi_is_abs, theta_is_abs);
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Rotates the EYE camera counterclockwise (CCW) around its origin by given angles.
 * Performs delta rotation or sets camera absolute rotation depending on the "*_is_abs" parameters.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.rotate_eye_camera
 * @param {Object} camobj Camera object ID
 * @param {Number} phi Azimuth angle in radians
 * @param {Number} theta Elevation angle in radians
 * @param {Boolean} [phi_is_abs=false] For phi angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 * @param {Boolean} [theta_is_abs=false] For theta angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 */
exports.rotate_eye_camera = function(camobj, phi, theta, phi_is_abs, theta_is_abs) {
    if (!camera.is_eye_camera(camobj)) {
        m_print.error("rotate_eye_camera(): wrong object");
        return;
    }

    camera.rotate_eye_camera(camobj, phi, theta, phi_is_abs, theta_is_abs);
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Rotates the HOVER camera around its pivot by given angles
 * Performs delta rotation or sets camera absolute rotation depending on the "*_is_abs" parameters.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.rotate_hover_camera
 * @param {Object} camobj Camera object ID
 * @param {Number} phi Azimuth angle in radians
 * @param {Number} theta Elevation angle in radians
 * @param {Boolean} [phi_is_abs=false] For phi angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 * @param {Boolean} [theta_is_abs=false] For theta angle: if FALSE performs delta rotation, if TRUE sets camera absolute rotation
 */
exports.rotate_hover_camera = function(camobj, phi, theta, phi_is_abs, theta_is_abs) {
    if (!camera.is_hover_camera(camobj)) {
        m_print.error("rotate_hover_camera(): wrong object");
        return;
    }

    camera.rotate_hover_camera(camobj, phi, theta, phi_is_abs, theta_is_abs);
    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Rotate the EYE camera around its origin by given delta angles
 * @method module:camera.rotate
 * @param {Object} camobj Camera Object ID
 * @param {Number} delta_phi Azimuth angle delta in radians
 * @param {Number} delta_theta Elevation angle delta in radians
 * @deprecated Use rotate_camera() or rotate_eye_camera() instead
 */
exports.rotate = function(camobj, delta_phi, delta_theta) {
    m_print.error("rotate() deprecated, use rotate_camera() or rotate_eye_camera() instead");
    exports.rotate_eye_camera(camobj, delta_phi, -delta_theta);
}

/**
 * Get camera azimuth and elevation angles (CCW as seen from the rotation axis) 
 * for the TARGET/HOVER move style or camera orientation angles for the EYE move style.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.get_camera_angles
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [dest] Destination vector for the camera angles: [phi, theta],
 * phi ~ [0, 2PI], theta ~ [-PI, PI]
 * @returns {Float32Array} Destination vector for the camera angles: [phi, theta]
 */
exports.get_camera_angles = function(camobj, dest) {
    if (!dest)
        var dest = new Float32Array(2);
    camera.get_camera_angles(camobj, dest);
    return dest;
}

/**
 * Get camera azimuth and elevation angles (CCW as seen from the rotation axis)
 * for the TARGET/HOVER move style or camera orientation angles for the EYE move style.
 * Angles are converted for the character object.
 * @see https://www.blend4web.com/doc/en/camera.html#api
 * @method module:camera.get_camera_angles_char
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} [dest] Destination vector for the camera angles: [phi, theta],
 * phi ~ [0, 2PI], theta ~ [-PI, PI]
 * @returns {Float32Array} Destination vector for the camera angles: [phi, theta]
 */
exports.get_camera_angles_char = function(camobj, dest) {
    if (!dest)
        var dest = new Float32Array(2);
    camera.get_camera_angles_char(camobj, dest);
    return dest;   
}

/**
 * Get angles.
 * Get the camera horizontal and vertical angles
 * @method module:camera.get_angles
 * @param {Object} camobj Camera Object ID
 * @param {Float32Array} [dest] Destination vector for the camera angles: [h, v]
 * @returns {Float32Array} Destination vector for the camera angles: [h, v]
 * @deprecated Use get_camera_angles() instead
 */
exports.get_angles = function(camobj, dest) {
    m_print.error("get_angles() deprecated, use get_camera_angles() instead");
    if (!dest)
        var dest = new Float32Array(2);
    camera.get_angles(camobj, dest);
    return dest;
}

/**
 * Set distance to the convergence plane for a stereo camera.
 * @method module:camera.set_stereo_distance
 * @param {Object} camobj Camera object ID
 * @param {Number} conv_dist Distance from the convergence plane
 */
exports.set_stereo_distance = function(camobj, conv_dist) {

    var cameras = camobj._render.cameras;
    for (var i = 0; i < cameras.length; i++) {
        var cam = cameras[i];

        if (cam.type == camera.TYPE_STEREO_LEFT || 
                cam.type == camera.TYPE_STEREO_RIGHT)
            camera.set_stereo_params(cam, conv_dist, cam.stereo_eye_dist);
    }
}
/**
 * Get distance from the convergence plane for a stereo camera
 * @method module:camera.get_stereo_distance
 * @param {Object} camobj Camera object ID
 * @returns {Number} Distance from convergence plane
 */
exports.get_stereo_distance = function(camobj, conv_dist) {

    var cameras = camobj._render.cameras;
    for (var i = 0; i < cameras.length; i++) {
        var cam = cameras[i];

        if (cam.type == camera.TYPE_STEREO_LEFT || 
                cam.type == camera.TYPE_STEREO_RIGHT)
            return cam.stereo_conv_dist;
    }

    return 0;
}
/**
 * Returns true if the camera's eye is located under the water surface
 * @method module:camera.is_underwater
 * @param {Object} camobj Camera object ID
 * @returns {Boolean}
 * @deprecated Always returns false
 */
exports.is_underwater = function(camobj) {
    m_print.error("is_underwater() deprecated, always returns false");
    var render = camobj._render;
    return render.underwater;
}
/**
 * Translate the view plane.
 * @method module:camera.translate_view
 * @param {Object} camobj Camera object ID
 * @param {Number} x X coord (positive - left to right)
 * @param {Number} y Y coord (positive - down to up)
 * @param {Number} angle Rotation angle (clockwise)
 */
exports.translate_view = function(camobj, x, y, angle) {
    var cameras = camobj._render.cameras;
    for (var i = 0; i < cameras.length; i++) {
        var cam = cameras[i];

        // NOTE: camera projection matrix already has been updated in 
        // set_view method of camera
        if (!cam.reflection_plane) 
            camera.set_projection(cam, cam.aspect);

        var vec3_tmp = _vec3_tmp;
        vec3_tmp[0] = -x;
        vec3_tmp[1] = -y;
        vec3_tmp[2] = 0;

        m_mat4.translate(cam.proj_matrix, vec3_tmp, cam.proj_matrix);
        m_mat4.rotateZ(cam.proj_matrix, angle, cam.proj_matrix);

        m_mat4.multiply(cam.proj_matrix, cam.view_matrix, cam.view_proj_matrix);
        camera.calc_view_proj_inverse(cam);
        camera.calc_sky_vp_inverse(cam);
    }
}
/**
 * Get camera vertical field of view angle.
 * @method module:camera.get_fov
 * @param {Object} camobj Camera object ID
 * @returns {Number} Camera field of view (in radians)
 */
exports.get_fov = function(camobj) {
    return m_util.rad(camobj._render.cameras[0].fov);
}

/**
 * Set camera vertical field of view angle.
 * @method module:camera.get_fov
 * @param {Object} camobj Camera object ID
 * @param {Number} fov New camera field of view (in radians)
 */
exports.set_fov = function(camobj, fov) {
    var cameras = camobj._render.cameras;
    for (var i = 0; i < cameras.length; i++) {
        var cam = cameras[i];

        cam.fov = m_util.deg(fov);

        // see comments in translate_view()
        if (!cam.reflection_plane)
            camera.set_projection(cam, cam.aspect);

        m_mat4.multiply(cam.proj_matrix, cam.view_matrix, cam.view_proj_matrix);
        camera.calc_view_proj_inverse(cam);
        camera.calc_sky_vp_inverse(cam);
    }
}

/**
 * Up correction is required in some cases then camera releases from constrainted mode.
 * @method module:camera.correct_up
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} y_axis Axis vector
 */
exports.correct_up = function(camobj, y_axis) {
    if (!y_axis) {
        y_axis = m_util.AXIS_Y;
    }

    constraints.correct_up(camobj, y_axis);
}

/**
 * Zoom the camera on the object.
 * @method module:camera.zoom_object
 * @param {Object} camobj Camera object ID
 * @param {Object} obj Object ID
 */
exports.zoom_object = function(camobj, obj) {

    if (!camera.is_target_camera(camobj)) {
        m_print.error("zoom_object(): wrong object");
        return;
    }

    var calc_bs_center = false;

    var center = _vec3_tmp;
    transform.get_object_center(obj, calc_bs_center, center);
    set_pivot(camobj, center);
    transform.update_transform(camobj);

    var radius = transform.get_object_size(obj);
    var ang_radius = camera.get_angular_diameter(camobj) / 2;

    var dist_need = radius / Math.sin(ang_radius);
    var dist_current = transform.obj_point_distance(camobj, center);

    // +y move backward
    transform.move_local(camobj, 0, dist_need - dist_current, 0);

    transform.update_transform(camobj);
    m_phy.sync_transform(camobj);
}

/**
 * Set the orthogonal scale of the camera
 * @method module:camera.set_ortho_scale
 * @param {Object} camobj Camera object ID
 * @param {Number} ortho_scale Orthogonal scale
 */

exports.set_ortho_scale = function(camobj, ortho_scale) {
    if (!camera.is_camera(camobj) || !exports.is_ortho_camera(camobj)) {
        m_print.error("set_ortho_scale(): wrong object");
        return;
    }

    var render = camobj._render;

    if (camera.is_target_camera(camobj)) {
        var dir_dist = m_vec3.dist(render.trans, render.pivot);
        render.init_top = ortho_scale / 2 * render.init_dist / dir_dist;
    } else if (camera.is_hover_camera(camobj) 
            && exports.has_distance_limits(camobj)) {
        var dir_dist = m_vec3.distance(render.trans, render.hover_pivot);
        render.init_top = ortho_scale / 2 * render.init_dist / dir_dist;
    } else
        // hover camera without distance limits, eye or static camera
        camobj._render.cameras[0].top = ortho_scale / 2;

    camera.update_ortho_scale(camobj);
}

/**
 * Get the orthogonal scale of the camera
 * @method module:camera.get_ortho_scale
 * @param {Object} camobj Camera object ID
 * @returns {Number} Orthogonal scale
 */

exports.get_ortho_scale = function(camobj) {
    if (!camera.is_camera(camobj) || !exports.is_ortho_camera(camobj)) {
        m_print.error("get_ortho_scale(): wrong object");
        return;
    }

    return camobj._render.cameras[0].top * 2;
}

/**
 * Is the camera ORTHO? 
 * @method module:camera.is_ortho_camera
 * @param {Object} camobj Camera Object ID
 * @returns {Boolean} In case of the orthogonal type of the camera it is true, else false
 */

exports.is_ortho_camera = function(camobj) {
    if (!camera.is_camera(camobj)) {
        m_print.error("is_ortho_camera(): wrong object");
        return;
    }
    
    return camobj._render.cameras[0].type == camera.TYPE_ORTHO;
}

/**
 * Calculate the direction of the camera ray based on screen coords
 * Screen space origin is the top left corner
 * @method module:camera.calc_ray
 * @param {Object} camobj Camera object ID
 * @param {Number} xpix X screen coordinate
 * @param {Number} ypix Y screen coordinate
 * @param {Float32Array} [dest] Destination vector
 * @returns {Float32Array} Destination vector
 */
exports.calc_ray = function(camobj, xpix, ypix, dest) {

    if (!dest)
        var dest = new Float32Array(3);

    var cam = camobj._render.cameras[0];

    switch (cam.type) {
    case camera.TYPE_PERSP:
    case camera.TYPE_PERSP_ASPECT:
    case camera.TYPE_STEREO_LEFT:
    case camera.TYPE_STEREO_RIGHT:
        var top_1m = Math.tan(cam.fov * Math.PI / 360.0);
        var right_1m = top_1m * cam.aspect;

        var dir = _vec4_tmp;

        // in the camera's local space
        dir[0] = (2.0 * xpix / cam.width - 1.0) * right_1m;
        dir[1] = -1;
        dir[2] = (2.0 * ypix / cam.height - 1.0) * top_1m;
        dir[3] = 0;

        var wm = camobj._render.world_matrix;
        m_vec4.transformMat4(dir, wm, dir);

        dest[0] = dir[0];
        dest[1] = dir[1];
        dest[2] = dir[2];

        m_vec3.normalize(dest, dest);

        return dest;
    default:
        m_print.error("Non-compatible camera");
        return dest;
    }
}

/**
 * Project point on the viewport.
 * Screen space origin is the top left corner.
 * Returnd coordinates are in device pixels (not CSS)
 * @method module:camera.project_point
 * @param {Object} camobj Camera object ID
 * @param {Float32Array} point Point in world space
 * @param {Float32Array} [dest] Destination vector
 * @returns {Float32Array} Viewport coordinates
 */
exports.project_point = function(camobj, point, dest) {
    if (!dest)
        var dest = new Float32Array(2);

    return camera.project_point(camobj, point, dest);
}

}
