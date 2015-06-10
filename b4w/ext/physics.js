"use strict";

/**
 * Physics module. Provides API to uranium.js physics engine. 
 * @module physics
 * @local collision_callback
 * @local ray_test_callback
 */
b4w.module["physics"] = function(exports, require) {

var m_print   = require("__print");
var physics   = require("__physics");
var util      = require("__util");

/**
 * Collision callback.
 * @callback collision_callback
 * @param {Boolean} is_collision Collision flag
 * @param {Float32Array} collision_point XYZ vector with collision point
 */

/**
 * Ray test callback.
 * @callback ray_test_callback
 * @param {Boolean} is_hit Ray hit flag
 * @param {Number} hit_frac Fraction of ray length where hit has occured (0-1)
 */


/**
 * The character's type of movement is "walk".
 * @const module:physics.CM_WALK
 */
exports.CM_WALK = 0;
/**
 * The character's type of movement is "run".
 * @const module:physics.CM_RUN
 */
exports.CM_RUN = 1;
/**
 * The character's type of movement is "climb".
 * @const module:physics.CM_CLIMB
 */
exports.CM_CLIMB = 2;
/**
 * The character's type of movement is "fly".
 * @const module:physics.CM_FLY
 */
exports.CM_FLY = 3;

/**
 * Enable physics simulation.
 * @method module:physics.enable_simulation
 * @param {Object} obj Object ID
 */
exports.enable_simulation = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.enable_simulation(obj);
}
/**
 * Disable physics simulation.
 * @method module:physics.disable_simulation
 * @param {Object} obj Object ID
 */
exports.disable_simulation = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.disable_simulation(obj);
}
/**
 * Check if the object has any physics
 * @method module:physics.has_physics
 * @param {Object} obj Object ID
 * @returns {Boolean} Check result
 */
exports.has_physics = function(obj) {
    return physics.has_physics(obj);
}
/**
 * Check if the object has any simulated physics
 * @method module:physics.has_simulated_physics
 * @param {Object} obj Object ID
 * @returns {Boolean} Check result
 */
exports.has_simulated_physics = function(obj) {
    return physics.has_simulated_physics(obj);
}
/**
 * Check if the object has dynamic simulated physics
 * @method module:physics.has_dynamic_physics
 * @param {Object} obj Object ID
 * @returns {Boolean} Check result
 */
exports.has_dynamic_physics = function(obj) {
    return physics.has_dynamic_physics(obj);
}
/**
 * Set the object's gravity.
 * @method module:physics.set_gravity
 * @param {Object} obj Object ID
 * @param {Number} gravity Positive object gravity
 */
exports.set_gravity = function(obj, gravity) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_gravity(obj, gravity);
}
/**
 * Set the object's linear/angular damping.
 * @method module:physics.set_damping
 * @param {Object} obj Object ID
 * @param {Number} damping Linear damping
 * @param {Number} rotation_damping Angular damping
 * settings
 */
exports.set_damping = function(obj, damping, rotation_damping) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    var body_id = obj._physics.body_id;
    physics.post_msg("set_damping", body_id, damping, rotation_damping);
}
/**
 * Reset the object's linear/angular damping to default values.
 * @method module:physics.reset_damping
 * @param {Object} obj Object ID
 */
exports.reset_damping = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    var game = obj["game"];
    var damping = game["damping"];
    var rdamping = game["rotation_damping"];

    var body_id = obj._physics.body_id;
    physics.post_msg("set_damping", body_id, damping, rdamping);
}

/**
 * Set the object's transform (for static/kinematic objects)
 * @method module:physics.set_transform
 * @param {Object} obj Object ID
 * @param {Float32Array} trans Translation vector
 * @param {Float32Array} quat Rotation quaternion
 */
exports.set_transform = function(obj, trans, quat) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_transform.apply(this, arguments);
}

/**
 * Sync the object's transform (for static/kinematic objects)
 * @method module:physics.sync_transform
 * @param {Object} obj Object ID
 */
exports.sync_transform = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.sync_transform(obj);
}

/**
 * Apply velocity to the object (in the local space)
 * @method module:physics.apply_velocity
 * @param {Object} obj Object ID
 * @param {Number} vx_local Vx local space velocity
 * @param {Number} vy_local Vy local space velocity
 * @param {Number} vz_local Vz local space velocity 
 */
exports.apply_velocity = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.apply_velocity.apply(this, arguments);
}
/**
 * Apply velocity to the object (in the world space)
 * @method module:physics.apply_velocity_world
 * @param {Object} obj Object ID
 * @param {Number} vx Vx world space velocity
 * @param {Number} vy Vy world space velocity
 * @param {Number} vz Vz world space velocity
 */
exports.apply_velocity_world = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.apply_velocity_world.apply(this, arguments);
}
/**
 * Apply a constant force to the object (in the local space).
 * Pass zero values to remove applied force.
 * @method module:physics.apply_force
 * @param {Object} obj Object ID
 * @param {Number} fx_local Fx force in the local space
 * @param {Number} fy_local Fy force in the local space
 * @param {Number} fz_local Fz force in the local space 
 */
exports.apply_force = function(obj, fx_local, fy_local, fz_local) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.apply_force.apply(this, arguments);
}

/**
 * Apply constant torque to the object (in the local space).
 * Pass zero values to remove applied torque.
 * @method module:physics.apply_torque
 * @param {Object} obj Object ID
 * @param {Number} tx_local Tx torque
 * @param {Number} ty_local Ty torque
 * @param {Number} tz_local Tz torque
 */
exports.apply_torque = function(obj, tx_local, ty_local, tz_local) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.apply_torque.apply(this, arguments);
}
/**
 * Apply throttle to vehicle.
 * @method module:physics.vehicle_throttle
 * @param {Object} obj Object ID
 * @param {Number} engine_force Engine force (-1..1)
 */
exports.vehicle_throttle = function(obj, engine_force) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    if (!physics.is_vehicle_chassis(obj) && !physics.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    physics.vehicle_throttle(obj, util.clamp(engine_force, -1, 1));
}
/**
 * Increment vehicle throttle.
 * @method module:physics.vehicle_throttle_inc
 * @param {Object} obj Object ID
 * @param {Number} engine_force Engine force increment (0..1)
 * @param {Number} dir Throttling direction -1,0,1
 */
exports.vehicle_throttle_inc = function(obj, engine_force_inc, dir) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    if (!physics.is_vehicle_chassis(obj) && !physics.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    engine_force_inc = util.clamp(engine_force_inc, 0, 1);

    var vehicle = obj._vehicle;

    var force = vehicle.engine_force;

    if (dir == -1 || dir == 1) {
        force += dir * engine_force_inc;
        force = Math.max(-1, Math.min(force, 1));
    } else if (dir == 0 && force >= 0) {
        force -= engine_force_inc;
        force = Math.max(0, force);
    } else if (dir == 0 && force < 0) {
        force += engine_force_inc;
        force = Math.min(0, force);
    } else
        m_print.error("Wrong steering direction");

    physics.vehicle_throttle(obj, util.clamp(force, -1, 1));
}
/**
 * Change vehicle steering.
 * @method module:physics.vehicle_steer
 * @param {Object} obj Object ID
 * @param {Number} steering_value Steering value (-1..1)
 */
exports.vehicle_steer = function(obj, steering_value) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    if (!physics.is_vehicle_chassis(obj) && !physics.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    physics.vehicle_steer(obj, util.clamp(steering_value, -1, 1));
}
/**
 * Increment vehicle steering.
 * @method module:physics.vehicle_steer_inc
 * @param {Object} obj Object ID
 * @param {Number} steering_value Steering value increment (0..1)
 * @param {Number} dir Steering direction -1,0,1
 */
exports.vehicle_steer_inc = function(obj, steering_value_inc, dir) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    if (!physics.is_vehicle_chassis(obj) && !physics.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    steering_value_inc = util.clamp(steering_value_inc, 0, 1);

    var vehicle = obj._vehicle;

    var steering = vehicle.steering;

    if (dir == -1 || dir == 1) {
        steering += dir * steering_value_inc;
        steering = Math.max(-1, Math.min(steering, 1));
    } else if (dir == 0 && steering >= 0) {
        steering -= steering_value_inc;
        steering = Math.max(0, steering);
    } else if (dir == 0 && steering < 0) {
        steering += steering_value_inc;
        steering = Math.min(0, steering);
    } else
        m_print.error("Wrong steering direction");

    physics.vehicle_steer(obj, util.clamp(steering, -1, 1));
}
/**
 * Stop the vehicle by applying the brake force.
 * @method module:physics.vehicle_brake
 * @param {Object} obj Object ID
 * @param {Number} brake_force Brake force (0..1)
 */
exports.vehicle_brake = function(obj, brake_force) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    if (!physics.is_vehicle_chassis(obj) && !physics.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    physics.vehicle_brake(obj, util.clamp(brake_force, 0, 1));
}
/**
 * Increment the brake force
 * @method module:physics.vehicle_brake_inc
 * @param {Object} obj Object ID
 * @param {Number} brake_force Brake force increment (-1..1)
 */
exports.vehicle_brake_inc = function(obj, brake_force_inc) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }

    if (!physics.is_vehicle_chassis(obj) && !physics.is_vehicle_hull(obj))
        m_print.error("Wrong object");

    brake_force_inc = util.clamp(brake_force_inc, -1, 1);

    var vehicle = obj._vehicle;

    var brake_force = vehicle.brake_force;

    brake_force += brake_force * brake_force_inc;
    physics.vehicle_brake(obj, util.clamp(brake_force, 0, 1));
}
/**
 * Check if the given object is a vehicle chassis.
 * @method module:physics.is_vehicle_chassis
 * @param {Object} obj Object ID
 */
exports.is_vehicle_chassis = function(obj) {
    return physics.is_vehicle_chassis(obj);
}
/**
 * Check if the given object is a vehicle hull.
 * @method module:physics.is_vehicle_hull
 * @param {Object} obj Object ID
 */
exports.is_vehicle_hull = function(obj) {
    return physics.is_vehicle_hull(obj);
}
/**
 * Get the vehicle name.
 * @method module:physics.get_vehicle_name
 * @param {Object} obj Object ID
 */
exports.get_vehicle_name = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return null;
    }
    if (physics.is_vehicle_chassis(obj) || physics.is_vehicle_hull(obj))
        return obj["b4w_vehicle_settings"]["name"];
    else {
        m_print.error("Wrong object");
        return null;
    }
}
/**
 * Get the vehicle's throttle value.
 * @method module:physics.get_vehicle_throttle
 * @param {Object} obj Object ID
 */
exports.get_vehicle_throttle = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return null;
    }
    if (physics.is_vehicle_chassis(obj) || physics.is_vehicle_hull(obj))
        return obj._vehicle.engine_force;
    else
        m_print.error("Wrong object");
}
/**
 * Get the vehicle's steering value.
 * @method module:physics.get_vehicle_steering
 * @param {Object} obj Object ID
 * @returns {Number} Steering value
 */
exports.get_vehicle_steering = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return null;
    }
    if (physics.is_vehicle_chassis(obj) || physics.is_vehicle_hull(obj))
        return obj._vehicle.steering;
    else
        m_print.error("Wrong object");
}
/**
 * Get the vehicle's brake force.
 * @method module:physics.get_vehicle_brake
 * @param {Object} obj Object ID
 * @returns {Number} Brake value
 */
exports.get_vehicle_brake = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return null;
    }
    if (physics.is_vehicle_chassis(obj) || physics.is_vehicle_hull(obj))
        return obj._vehicle.brake_force;
    else
        m_print.error("Wrong object");
}
/**
 * Get the vehicle speed in km/h.
 * @method module:physics.get_vehicle_speed
 * @param {Object} obj Object ID
 * @returns {Number} Vehicle speed
 */
exports.get_vehicle_speed = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return null;
    }
    if (physics.is_vehicle_chassis(obj) || physics.is_vehicle_hull(obj))
        return physics.get_vehicle_speed(obj);
    else
        m_print.error("Wrong object");
}
/**
 * Check if the given object is a character.
 * @method module:physics.is_character
 * @param {Object} obj Object ID
 * @returns {Boolean} Check result
 */
exports.is_character = function(obj) {
    return physics.is_character(obj);
}
/**
 * Move the character in the corresponding direction.
 * @method module:physics.set_character_move_dir
 * @param {Object} obj Object ID
 * @param {Number} forw Apply forward speed
 * @param {Number} side Apply side speed
 */
exports.set_character_move_dir = function(obj, forw, side) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_move_dir(obj, forw, side);
}
/**
 * Set the character moving type.
 * @method module:physics.set_character_move_type
 * @param {Object} obj Object ID
 * @param {Number} type Character moving type (0 - walk, 1 - run, 2 - vertical climb)
 */
exports.set_character_move_type = function(obj, type) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_move_type(obj, type);
}

/**
 * Set the character's walk speed.
 * @method module:physics.set_character_walk_velocity
 * @param {Object} obj Object ID
 * @param {Number} velocity Walking velocity
 */
exports.set_character_walk_velocity = function(obj, velocity) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_walk_velocity(obj, velocity);
}
/**
 * Set the character's run speed.
 * @method module:physics.set_character_run_velocity
 * @param {Object} obj Object ID
 * @param {Number} velocity Running velocity
 */
exports.set_character_run_velocity = function(obj, velocity) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_run_velocity(obj, velocity);
}
/**
 * Set the character's fly speed.
 * @method module:physics.set_character_fly_velocity
 * @param {Object} obj Object ID
 * @param {Number} velocity Flying velocity
 */
exports.set_character_fly_velocity = function(obj, velocity) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_fly_velocity(obj, velocity);
}
/**
 * Make the character jump
 * @method module:physics.character_jump
 * @param {Object} obj Object ID
 */
exports.character_jump = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.character_jump(obj);
}
/**
 * Increment the character rotation
 * @method module:physics.character_rotation_inc
 * @param {Object} obj Object ID
 * @param {Number} h_angle Angle in horizontal plane
 * @param {Number} v_angle Angle in vertical plane
 */
exports.character_rotation_inc = function(obj, h_angle, v_angle) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.character_rotation_inc(obj, h_angle, v_angle);
}
/**
 * Set the character rotation quaternion
 * @method module:physics.set_character_rotation_quat
 * @param {Object} obj Object ID
 * @param {Float32Array} quat Rotation quaternion
 */
exports.set_character_rotation_quat = function(obj, quat) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_rotation_quat(obj, quat);
}
/**
 * Set the character rotation in horizontal and vertical planes
 * @method module:physics.set_character_rotation
 * @param {Object} obj Object ID
 * @param {Number} angle_h Angle in horizontal plane
 * @param {Number} angle_v Angle in vertical plane
 */
exports.set_character_rotation = function(obj, angle_h, angle_v) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_rotation(obj, angle_h, angle_v);
}
/**
 * Set the character vertical rotation
 * @method module:physics.set_character_rotation_v
 * @param {Object} obj Object ID
 * @param {Number} angle Angle in vertical plane
 */
exports.set_character_rotation_v = function(obj, angle) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_rotation_v(obj, angle);
}
/**
 * Set the character horizontal rotation
 * @method module:physics.set_character_rotation_h
 * @param {Object} obj Object ID
 * @param {Number} angle Angle in horizontal plane
 */
exports.set_character_rotation_h = function(obj, angle) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.set_character_rotation_h(obj, angle);
}
/**
 * Append a new async collision test to the given object.
 * @method module:physics.append_collision_test
 * @param {Object} obj Object ID
 * @param {String} collision_id Collision ID
 * @param {collision_callback} callback Collision callback
 * @param {Boolean} [need_collision_point=false] Pass collision point coords in callback
 */
exports.append_collision_test = function(obj, collision_id, callback,
        need_collision_point) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    need_collision_point = need_collision_point || false;
    physics.append_collision_test(obj, collision_id, callback, need_collision_point);
}
/**
 * Remove the collision test from the given object.
 * @method module:physics.remove_collision_test
 * @param {Object} obj Object ID
 * @param {String} collision_id Collision ID
 */
exports.remove_collision_test = function(obj, collision_id) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.remove_collision_test(obj, collision_id);
}
/**
 * Apply a new async collision impulse test to the given object.
 * @method module:physics.apply_collision_impulse_test
 * @param {Object} obj Object ID
 * @param callback Callision impulse test callback
 */
exports.apply_collision_impulse_test = function(obj, callback) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.apply_collision_impulse_test(obj, callback);
}
/**
 * Remove the collision impulse test from the given object.
 * @method module:physics.clear_collision_impulse_test
 * @param {Object} obj Object ID
 */
exports.clear_collision_impulse_test = function(obj) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.clear_collision_impulse_test(obj);
}
/**
 * Append new async ray test to given object.
 * @method module:physics.append_ray_test
 * @param {Object} obj Object ID
 * @param {String} collision_id Collision ID
 * @param {Float32Array} from From vector
 * @param {Float32Array} to To vector
 * @param {Boolean} local_coords From/To specified in local/world space
 * @param {ray_test_callback} callback Ray test callback
 */
exports.append_ray_test = function(obj, collision_id, from, to,
        local_coords, callback) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.append_ray_test(obj, collision_id, from, to, local_coords, callback);
}
/**
 * Remove ray test from given object.
 * @method module:physics.remove_ray_test
 * @param {Object} obj Object ID
 * @param {String} collision_id Collision ID
 * @param {Float32Array} from From vector
 * @param {Float32Array} to To vector
 * @param {Boolean} local_coords From/To specified in local/world space
 */
exports.remove_ray_test = function(obj, collision_id, from, to,
        local_coords) {
    if(!physics.has_physics(obj)) {
        m_print.error("No physics for object " + obj["name"]);
        return;
    }
    physics.remove_ray_test(obj, collision_id, from, to, local_coords);
}
/**
 * Apply physics constraint.
 * @method module:physics.apply_constraint
 * @param {String} pivot_type Pivot type
 * @param {Object} obj_a Object ID A
 * @param {Float32Array} trans_a Translation of pivot frame relative to A
 * @param {Float32Array} quat_a Rotation of pivot frame relative to A
 * @param {Object} obj_b Object ID B
 * @param {Float32Array} trans_b Translation of pivot frame relative to B
 * @param {Float32Array} quat_b Rotation of pivot frame relative to B
 * @param {Object} limits Object containting constraint limits
 * @param {Float32Array} [stiffness=null] 6-dimensional vector with constraint stiffness
 * @param {Float32Array} [damping=null] 6-dimensional vector with constraint damping
 */
exports.apply_constraint = function(pivot_type, obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b, limits, stiffness, damping) {

    if (!physics.has_physics(obj_a) || !physics.has_physics(obj_b)) {
        m_print.error("Wrong objects");
        return;
    }

    physics.apply_constraint(pivot_type, obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b, limits, stiffness, damping);
}
/**
 * Remove physics constraint.
 * constraint identified by object A from apply_constraint function
 * @method module:physics.remove_constraint
 * @param obj_a Object ID A
 */
exports.clear_constraint = function(obj_a) {
    if (!physics.has_physics(obj_a) || !physics.has_constraint(obj_a)) {
        m_print.error("Wrong object");
        return;
    }

    physics.clear_constraint(obj_a);
}
/**
 * Pull object A to constraint pivot with object B.
 * @method module:physics.pull_to_constraint_pivot
 * @param {Object} obj_a Object ID A
 * @param {Float32Array} trans_a Translation of pivot frame relative to A
 * @param {Float32Array} quat_a Rotation of pivot frame relative to A
 * @param {Object} obj_b Object ID B
 * @param {Float32Array} trans_b Translation of pivot frame relative to B
 * @param {Float32Array} quat_b Rotation of pivot frame relative to B
 */
exports.pull_to_constraint_pivot = function(obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b) {

    if (!physics.has_physics(obj_a) || !physics.has_physics(obj_b)) {
        m_print.error("Wrong objects");
        return;
    }
    physics.pull_to_constraint_pivot(obj_a, trans_a, quat_a,
        obj_b, trans_b, quat_b);
}

}
