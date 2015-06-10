declare module b4w{

  export interface Module{
    init(options?:{

    });
  }

  export function module_check(module_name:string):boolean;
  export function register(module_name:string, module_body:Function):void;
  //ns: Namespace for processed modules,Default is __B4W_DEF_NS
  export function require(module_name:string,ns?:string):Module;

  export function ModuleFunction(exports:any, require:Function);

//https://www.blend4web.com/api_doc/module-app.html#.init
  export interface App{
    init(options?:{
      canvas_container_id?:string;
      callback?:Function;
      error_purge_elements?:boolean;//Remove interface elements after error.
      gl_debug?:boolean;
      show_hud_debug_info?:boolean;//Show HUD with developer info.
      show_fbs:boolean;
      fps_elem_id:string;//Custom fps counter id.
      fps_wrapper_id:string;//Show FPS wrapper with current id.
      report_init_failure:boolean;//Show elements with info about init failure
      pause_invisible:boolean;//Pause engine simulation if page is not visible (in other tab or minimized).
      key_pause_enabled:boolean;//Enable key pause
      autoresize:boolean;//Automatically resize canvas to match the size of container element.
    });

    attr_animate(elem:Element,attr_name:string,from:number,to:number,timeout:number,opt_callback:Function);
    css_animate(elem:Element,prop:string,from:number,to:number,timeout:number,opt_prefix:string,opt_suffix:string,opt_callback:Function);

    disable_camera_controls():void;//Disable controls for the active camera.
    disable_controls():void;//Disable engine controls.
    disable_object_controls(obj:any):void//Disable controls for the non-camera object. obj: Object ID or Camera object ID
    //Assign keyboard and mouse controls to the active camera. (arrow keys, ADSW, wheel and others)
    //disable_default_pivot:Do not use the possible camera-defined pivot point应该是禁止旋转的意思
    //disable_letter_controls:Disable keyboard letter controls (only arrow keys will be used to control the camera) 应该是禁止WASD控制，只允许上下左右键控制
    enable_camera_controls(disable_default_pivotopt?:boolean, disable_letter_controlsopt?:boolean);
    //Enable engine controls. Execute before using any of the controls.*() functions
    enable_controls():void;
    /*
    Enable debug controls:
    K - make camera debug shot
    L - make light debug shot
    M - flashback messages
    */
    enable_debug_controls():void
    enable_object_controls(obj:any);

    //Set the movement style for the active camera.
    set_camera_move_style(move_style:number);

    check_fullscreen():boolean;
    exit_fullscreen():void;
    request_fullscreen(elem:Element, enabled_cb:Function, disabled_cb:Function);


    get_url_params(allow_param_array:boolean):Object;
    /*
    Report an application error. Creates standard HTML elements with error info and inserts them in the page body.
    text_message	String	Message to place on upper element.
    link_message	String	Message to place on bottom element.
    link	String	Link to place on bottom element.
    purge_elements	Array	Array of elements to destroy just before the error elements are inserted.
    */
    report_app_error(text_message:string, link_message:string, link:string, purge_elements:Array<any>):void;
  }

  export interface Animation{
    AB_CYCLIC:number;//Animation behavior: cyclic.
    AB_FINISH_RESET:number;//Animation behavior: go back to the zero frame after finishing.
    AB_FINISH_STOP:number;//Animation behavior: stop the animation after finishing.
    OBJ_ANIM_TYPE_ARMATURE:number;//Animation type: armature.
    OBJ_ANIM_TYPE_MATERIAL:number;//Animation type: material
    OBJ_ANIM_TYPE_OBJECT:number;//Animation type: object.
    OBJ_ANIM_TYPE_PARTICLES:number;//Animation type: particles.
    OBJ_ANIM_TYPE_SOUND:number;//Animation type: sound.
    OBJ_ANIM_TYPE_VERTEX:number;//Animation type: vertex.
    SLOT_0:number;//Object's animation slot 0.
    SLOT_1:number;//Object's animation slot 1.
    SLOT_2:number;//Object's animation slot 2.
    SLOT_3:number;//Object's animation slot 3.
    SLOT_4:number;//Object's animation slot 4.
    SLOT_5:number;//Object's animation slot 5.
    SLOT_6:number;//Object's animation slot 6.
    SLOT_7:number;//Object's animation slot 7.
    SLOT_ALL:number;//All object's animation slots.

    //Apply the animation to the object.
    apply(obj:any,name:string,slot_num?:number):void;
    //Apply the default animation (i.e. assigned in Blender) to the object.
    apply_def(obj:any);
    //Apply smoothing to the object's animation. In order to disable the smoothing, specify the zero periods.
    apply_smoothing(obj:any, trans_period?:number, quat_period?:number, slot_num?:number):void;
    /*
    Apply the animation to the first available animation slot.
    Slot number or -1 if no empty slots found
    */
    apply_to_first_empty_slot(obj:any,name:string):number;

    //Whether the object's animation playback should be looped or not.
    cyclic(obj:any, cyclic_flag:boolean, slot_num?:number):void;

    //Convert animation frames to seconds.
    frame_to_sec(frame:number):number;

    //Return the names of all available animations.
    get_actions():Array<string>;

    //Get the length of the object's animation measured in frames.
    get_anim_length(obj:any,slot_num?:number):number;

    //Return the names of all available animations.
    get_anim_names(obj:any):Array<string>;

    /*
    Get the starting frame of the object's animation.
    Animation start frame or -1 for incorrect object
    */
    get_anim_start_frame(obj:any,slot_num?:number):number;

    /*
    Get the object's animation type.
    Animation type, one of OBJ_ANIM_TYPE_*
    */
    get_anim_type(obj:any, slot_num?:number):number;

    //Get behavior of the object's animation.
    get_behavior(obj:any, slot_num?:number):any;

    //Get the translation of the armature's bone.
    get_bone_translation(armobj:any, bone_name:string, dest:Vec3):any;

    //Return the name of the applied animation.
    get_current_action(obj:any, slot_num?:number):string;

    //Return the name of the applied animation.
    get_current_anim_name(obj:any, slot_num?:number):string;

    //Get the current frame
    get_current_frame_float(obj:any, slot_num?:number):number;

    //Get the first armature object used for skinning of the given mesh object.
    get_first_armature_object(obj:any):any;

    //Get the current frame of the object's animation.
    get_frame(obj:any, slot_num?:number):number;

    /*
    Get animation frame range
    Return: Frame range pair or null for incorrect object
    */
    get_frame_range(obj:any, slot_num?:number):Array<any>;

    //Get the mix factor for the skeletal animations assigned to the last two animation slots.
    get_skel_mix_factor(armobj:any):void;

    //Get the slot number of the object to which the animation is assigned.
    get_slot_num_by_anim(obj:any, anim_name:string):number;

    //Get the speed of the object's animation.
    get_speed(obj:any, slot_num?:number):number;

    //Check if the object is animated.
    is_animated(obj:any):boolean;

    //Check if the object's animation is looped.
    is_cyclic(obj:any, slot_num?:number):boolean;

    //Check if the object's animation is being played back.
    is_play(obj:any, slot_num?:number):boolean;

    //Play the object's animation.
    //The animation must be applied to the object before, or the object must have the default animation
    // (i.e. assigned in Blender).
    play(obj:any,finish_callback:Function,slot_num?:number):boolean;

    //Remove the animation from the object.
    remove(obj:any):void;

    //Remove the animation from the given animation slot of the object.
    remove_slot_animation(obj:any, slot_num?:number):void;

    //Set the current frame.
    set_current_frame_float(obj:any, cff:number, slot_num?:number);

    //  Set the current frame of the object's animation.
    set_frame(obj:any, frame:number, slot_num?:number);

    //Set the mix factor for the skeletal animations assigned to the last two animation slots.
    // Specify the non-zero time for smooth animation transitions.
    set_skel_mix_factor(armobj:any, factor:number, time?:number);

    //Set the speed of the object's animation.
    set_speed(obj:any, speed:number, slot_num?:number);

    //Stop the object's animation.
    stop(obj:any,slot_number?:number);

    //Update object animation (set the pose)
    update_object_animation(obj:any, elapsed:number, slot_num?:number, force_update?:boolean);
  }

  export class Objects{
    copy(obj:Objects,new_name:string,deep_copy:boolean):Objects;

    //Get the Blender-assigned meta tags from the object.
    get_meta_tags():Array<ObjectMetaTags>;

    //Set object's material node rgb.
    set_nodemat_rgb(obj:Objects,name_list:Array<string>,r:number,g:number,b:number);

    //Set object's material node value.
    set_nodemat_value(obj:Objects,name_list:Array<string>);
  }

  export class ObjectMetaTags{
    title:string;
    description:string;
    category:string;
  }


  export class Vec3{
    add(a:Vec3,b:Vec3,out:Vec3):Vec3;
    angle(a:Vec3, b:Vec3):number; //radians
    clone(a:Vec3):Vec3;
    copy(a:Vec3,out:Vec3):Vec3;
    create():Vec3;
    cross(a:Vec3,b:Vec3,out:Vec3):Vec3;//交叉乘积
    dist(a:Vec3,b:Vec3):number;//Alias for vec3.distance
    distance(a:Vec3, b:Vec3):number;
    div(a:Vec3, b:Vec3, out:Vec3):Vec3;//Alias for vec3.divide
    divide(a:Vec3, b:Vec3, out:Vec3):Vec3;
    dot(a:Vec3, b:Vec3):number;
    forEach(a:Array<Vec3>,stride:number,offset:number,count:number,fn:Function,args?:any):void;
    fromValues(x,y,z):Vec3;//Creates a new vec3 initialized with the given values
    inverse(a:Vec3, out:Vec3):Vec3;//逆矩阵
    len(a:Vec3):number;
    length(a:Vec3):number;
    /*
    Performs a linear interpolation between two vec3's
    a	vec3	the first operand
    b	vec3	the second operand
    t	Number	interpolation amount between the two inputs
    out	vec3	the receiving vector
    */
    lerp(a:Vec3, b:Vec3, t:number, out:Vec3):Vec3;

    max(a:Vec3,b:Vec3,out:Vec3):Vec3;
    min(a:Vec3,b:Vec3,out:Vec3):Vec3;
    mul(a:Vec3, b:Vec3, out:Vec3):Vec3;
    multiply(a:Vec3, b:Vec3, out:Vec3):Vec3;

    negate(a:Vec3, out:Vec3):Vec3;//反转
    normalize(a:Vec3, out:Vec3):Vec3;

    //Generates a random vector with the given scale
    random(scale:number,out:Vec3):Vec3;
    random(out:Vec3):Vec3;

    rotateX(a:Vec3, b:Vec3, c:number, out:Vec3):Vec3;
    rotateY(a:Vec3, b:Vec3, c:number, out:Vec3):Vec3;
    rotateZ(a:Vec3, b:Vec3, c:number, out:Vec3):Vec3;

    scale(a:Vec3,b:number,out:Vec3):Vec3;
    scaleAndAdd(a:Vec3,b:Vec3,scale:number,out:Vec3):Vec3;
    set(x:number,y:number,z:number,out:Vec3):Vec3;
    sqrDist(a:Vec3, b:Vec3):number;//Alias for vec3.squaredDistance
    sqrLen(a:Vec3):number;//Alias for vec3.squaredLength
    squaredDistance(a:Vec3, b:Vec3):number;
    squaredLength(a:Vec3):number;
    str(vec:Vec3):string;//Returns a string representation of a vector
    sub(a:Vec3,b:Vec3,out:Vec3):Vec3;//Alias for vec3.subtract
    subtract(a:Vec3,b:Vec3,out:Vec3):Vec3;//Subtracts vector b from vector a
    transformMat3(a:Vec3, m:Mat4, out:Vec3):Vec3;//Transforms the vec3 with a mat3.
    transformMat4(a:Vec3, m:Mat4, out:Vec3):Vec3;//Transforms the vec3 with a mat4. 4th vector component is implicitly '1'
    transformQuat(a:Vec3, q:Quat, out:Vec3):Vec3;
  }

  export class Vec4{
    add(a:Vec4,b:Vec4,out:Vec4):Vec4;
    clone(a:Vec4):Vec4;
    copy(a:Vec4,out:Vec4):Vec4;
    create():Vec4;
    dist(a:Vec4, b:Vec4):Vec4;//Alias for vec4.distance
    distance(a:Vec4, b:Vec4):Vec4;//Calculates the euclidian distance between two vec4's
    div(a:Vec4, b:Vec4, out:Vec4):Vec4;//Alias for vec4.divide
    divide(a:Vec4, b:Vec4, out:Vec4):Vec4;//Divides two vec4's
    dot(a:Vec4, b:Vec4):Vec4;//点积
    forEach(a:Array<Vec4>, stride:number, offset:number, count:number, fn:Function, arg?:any):Array<Vec4>;
    fromValues(x:number,y:number,z:number,w:number):Vec4;
    inverse(a:Vec4, out:Vec4):Vec4;//求逆
    len();//Alias for vec4.length
    length(a:Vec4):number;
    lerp(a:Vec4,b:Vec4,t:number,out:Vec4):Vec4;
    max(a:Vec4,b:Vec4,out:Vec4):Vec4;
    min(a:Vec4,b:Vec4,out:Vec4):Vec4;
    mul(a:Vec4, b:Vec4, out:Vec4):Vec4;//Alias for vec4.multiply
    multiply(a:Vec4, b:Vec4, out:Vec4):Vec4;//Multiplies two vec4's
    negate(a:Vec4, out:Vec4):Vec4;//取反
    normalize(a:Vec4, out:Vec4):Vec4;
    random(scale:number, out:Vec4) :Vec4;
    random(out:Vec4):Vec4;
    scale(a:Vec4,b:number,out:Vec4):Vec4;
    scaleAndAdd(a:Vec4, b:number, scale:number, out:Vec4):Vec4;
    set(x:number, y:number, z:number, w:number, out:Vec4):Vec4;
    sqrDist(a:Vec4, b:Vec4):number;//Alias for vec4.squaredDistance
    sqrLen(a:Vec4):number;//Alias for vec4.squaredLength
    squaredDistance(a:Vec4, b:Vec4):number;//Calculates the squared euclidian distance between two vec4's
    squaredLength(a:Vec4):number;//Calculates the squared length of a vec4

    str(vec:Vec4):string;
    sub(a:Vec4, b:Vec4, out:Vec4);//Alias for vec4.subtract
    subtract(a:Vec4, b:Vec4, out:Vec4); //Subtracts vector b from vector a
    transformMat4(a:Vec4, m:Mat4, out:Vec4):Vec4;//Transforms the vec4 with a mat4.
    transformQuat(a:Vec4, q:Quat, out:Vec4):Vec4;//Transforms the vec4 with a quat
  }

  export class Quat{

  }

  export class Mat4{

  }


  export class CameraAnim{
    auto_rotate(auto_rotate_ratio:number, callback?:Function);
    //Check if auto-rotation is possible for the camera. For example, the STATIC camera cannot be rotated.
    check_auto_rotate():boolean;
    //Check if the camera is auto-rotating.
    is_auto_rotate():boolean;
    //Smoothly rotate the EYE camera to make it pointing at the specified target (an object or some position).
    //Then smoothly zoom on this target, pause and zoom back.
    track_to_target(cam_obj, target:Float32Array,
      rot_speed:number, zoom_mult:number, zoom_time:number, zoom_delay:number,
      callback?:Function, zoom_cb?:Function);
  }


  export class Geometry{
    //Check if object has got shape keys.
    check_shape_keys(obj:Objects):boolean;

    //Extract the array of triangulated face indices from the given object.
    extract_index_array(obj:Objects,mat_name:string):any;//Uint16Array | Uint32Array

    //Extract the vertex array from the object.
    extract_vertex_array(obj:Objects, mat_name:string, attrib_name:string):Float32Array;

    //Return shape key current value.
    get_shape_key_value(obj:Objects, key_name:string):Array<number>;

    //Return all available shape keys names.
    get_shape_keys_names(obj:Objects):Array<string>;

    /*
      Override geometry for the given object.
      obj	Object	Object ID
      mat_name	String	Material name
      ibo_array	Uint16Array | Uint32Array	Array of triangle indices
      positions_array	Float32Array	New vertex positions array
      smooth_normals	Boolean	Enable normals smoothing
    */
    override_geometry(obj:Objects, mat_name:string, ibo_array:any, positions_array:Float32Array, smooth_normals:boolean);

    //Apply shape key to the object.
    set_shape_key_value(obj:Objects, key_name:string, value:number);

    /*
    Update the vertex array for the given object.
    Parameters:
    Name	           Type	             Description
    obj	           Object	              Object ID
    mat_name	           String	             Material name
    attrib_name	           String	              Attribute name (a_position, a_normal, a_tangent)
    array	           Float32Array	T             he new array
    */
    update_vertex_array(obj:Objects, mat_name:string, attrib_name:string, array:Float32Array);
  }

  export class Camera{
    MS_ANIMATION:string;//The camera's movement style: animated.
    MS_EYE_CONTROLS:string;//The camera's movement style: eye
    MS_HOVER_CONTROLS:string;//The camera's movement style: hover.
    MS_STATIC:string;//The camera's movement style: static (non-interactive).
    MS_TARGET_CONTROLS:string;//The camera's movement style: target.
    //Set the distance limits for the TARGET/HOVER camera.
    apply_distance_limits(camobj:Objects, min:number, max:number):void;
    //Set the horizontal angle limits for the TARGET/EYE camera, or the horizontal (X axis) translation limits for the HOVER camera.
    apply_horizontal_limits(camobj:Objects, left_value:number, right_value:number, space?:number);
    apply_hover_angle_limits(camobj:Objects, down_angle:number, up_angle:number);
    apply_vertical_limits(camobj:Objects, down_value:number, up_value:number, space?:number);
    calc_ray(camobj:Objects, xpix:number, ypix:number, dest?:Float32Array):Float32Array;
    clear_distance_limits(camobj:Objects);//Remove the distance clamping limits from the TARGET camera.
    clear_horizontal_limits(camobj:Objects);//Remove the horizontal clamping limits from the TARGET/EYE/HOVER camera.
    clear_hover_angle_limits(camobj:Objects);//Remove the hover angle limits from the HOVER camera.
    clear_vertical_limits(camobj:Objects);//Remove the vertical clamping limits from the TARGET/EYE/HOVER camera.

    //Correct the UP vector of the camera. This is sometimes required when the camera exits constrained mode.
    correct_up(camobj:Objects, y_axis:Float32Array);
    //Get the horizontal and vertical angles of the camera.
    get_angles(camobj:Objects, dest?:Float32Array):Float32Array;
    //Get the distance limits of the TARGET/HOVER camera.
    get_cam_dist_limits(camobj:Objects, dist?:Float32Array):Float32Array;
    //Get the azimuth and elevation angles (CCW as seen from the rotation axis) of the TARGET/HOVER camera,
    // or the orientation angles of the EYE camera.
    get_camera_angles(camobj:Objects, dest?:Float32Array):Float32Array;// [phi, theta]
    //Get the azimuth and elevation angles (CCW as seen from the rotation axis) of the TARGET/HOVER camera,
    //or the orientation angles of the EYE camera. The angles are converted for the character object.
    get_camera_angles_char(camobj:Objects, dest?:Float32Array):Float32Array;
    //Get the eye vector of the camera.
    get_eye(camobj:Objects, dest?:Float32Array):Float32Array;
    //Get the vertical angle of the camera's field of view.
    get_fov(camobj):number;
    //Set the vertical angle of the camera's field of view.
    get_fov(camobj, fov:number);
    //Get the horizontal angle limits of the TARGET/EYE camera (converted to the [0, 2PI] range),
    //or the horizontal translation limits of the HOVER camera.
    get_horizontal_limits(camobj, dest?:Float32Array):Float32Array;
    //Get the hover angle limits for the HOVER camera, converted to the [-PI, PI] range.
    get_hover_angle_limits(camobj, angles?:number):Float32Array;
    //Get the angle of the HOVER camera.
    get_hover_cam_angle(camobj):number;
    //Get the pivot translation of the HOVER camera.
    get_hover_cam_pivot(camobj):Float32Array;
    //Get the movement style of the camera.
    get_move_style(camobj):number;
    //Get the orthogonal scale of the camera.
    get_ortho_scale(camobj):number;
    //Get the pivot point of the camera.
    get_pivot(camobj, dest?:Float32Array):Float32Array;
    //Get the distance from the convergence plane of the stereoscopic camera.
    get_stereo_distance(camobj):number;
    //Get the velocity parameters of the camera.
    get_velocity_params(camobj, dest?:Float32Array):Float32Array;
    //Check whether the camera has its distance limited.
    has_distance_limits(camobj):boolean;
    has_horizontal_limits(camobj):boolean;

    //Set translation for the HOVER camera.
    hover_cam_set_translation(camobj, Translation:Float32Array);
    is_camera(obj):boolean;
    //Check if the object is a camera and has the MS_EYE_CONTROLS movement style.
    is_eye_camera(obj):boolean;
    //Check if the object is a camera and has the MS_HOVER_CONTROLS movement style.
    is_hover_camera(obj):boolean;
    //Check whether the camera is looking upwards.
    is_look_up(camobj):boolean;
    //Check whether the camera is an ORTHO camera.
    is_ortho_camera(camobj) :boolean;
    //Check if the object is a camera and has the MS_TARGET_CONTROLS movement style.
    is_target_camera(obj):boolean;
    //Check whether the camera eye is located under the water surface.
    is_underwater(camobj):boolean;
    //Translate the pivot point of the TARGET camera. +h from left to right +v from down to up
    move_pivot(camobj, trans_h_delta:number, trans_v_delta:number):boolean;
    //Project the 3D point to the screen. The origin of the screen space is located in the top left corner.
    //Returned coordinates are measured in device pixels (not CSS pixels).
    project_point(camobj, point:Float32Array, dest?:Float32Array) :Float32Array;
    //Rotate the EYE camera around its origin by the given delta angles.
    rotate(camobj, delta_phi:number, delta_theta:number);
    //Rotate the camera counterclockwise (CCW) by the given angles depending on the camera's movement style.
    //Performs the delta rotation or sets the camera's absolute rotation depending on the "*_is_abs" parameters.
    rotate_camera(camobj, phi:number, theta:number, phi_is_abs?:boolean, theta_is_abs?:boolean);
    //Rotate the EYE camera counterclockwise (CCW) around its origin by the given angles.
    // Performs the delta rotation or sets the camera's absolute rotation depending on the "*_is_abs" parameters.
    rotate_eye_camera(camobj, phi:number, theta:number, phi_is_abs?:boolean, theta_is_abs?:boolean);
    //Rotate the HOVER camera around the hover pivot point.
    rotate_hover_cam(camobj, angle:number);
    //Rotate the HOVER camera around its pivot by the given angles.
    // Performs the delta rotation or sets the camera's absolute rotation depending on the "*_is_abs" parameters.
    rotate_hover_camera(camobj, phi:number, theta:number, phi_is_abs?:boolean, theta_is_abs?:boolean);
    //Rotate the TARGET camera around the pivot point.
    rotate_pivot(camobj, delta_phi:number, delta_theta:number);
    //Rotate the TARGET camera counterclockwise (CCW) around its pivot by the given angles.
    // Performs the delta rotation or sets the camera's absolute rotation depending on the "*_is_abs" parameters.
    rotate_target_camera(camobj, phi:number, theta:number, phi_is_abs?:number, theta_is_abs?:number);
    set_eye_params();//Deprecated
    //Set the angle for the HOVER camera.
    set_hover_cam_angle(camobj, angle:number);
    //Set the pivot point for the HOVER camera.
    set_hover_pivot(camobj, coords:Float32Array);
    //Set the camera position based on the input parameters.
    // Performs vertical alignment of the camera based on the "up" parameter. This is a low-level function.
    set_look_at(camobj, eye:Float32Array, target:Float32Array, up:Float32Array);
    //Set the movement style (MS_*) for the camera.
    set_move_style(camobj, move_style):boolean;
    //Set the orthogonal scale of the camera.
    set_ortho_scale(camobj, ortho_scale:number);
    //Set the pivot point for the TARGET camera.
    set_pivot(camobj, coords:Float32Array);
    //Set the distance to the convergence plane of the stereoscopic camera.
    set_stereo_distance(camobj, conv_dist:number);
    //Set the translation and the pivot point for the TARGET camera.
    set_trans_pivot(camobj, trans:Float32Array, pivot:Float32Array);
    //Set the velocity parameters for the camera.
    set_velocity_params(camobj, velocity:Float32Array);
    //Translate the HOVER camera.
    translate_hover_cam_v(camobj, Translation:Float32Array);
    //Translate the view plane.
    translate_view(camobj, x:number, y:number, angle:number);
    //Zoom the camera to the object.
    zoom_object(camobj, obj);

  }

  export class Version{
    date():string;//date string in the format: "dd.mm.yyyy hh.mm.ss"
    type():string;//Get the release type: "DEBUG" or "RELEASE".
    version():string;
  }

  export class Assets{
    AT_ARRAYBUFFER;//Asset type: ArrayBuffer
    AT_AUDIO_ELEMENT;//Asset type: HTMLAudioElement
    AT_AUDIOBUFFER;//Asset type: AudioBuffer
    AT_IMAGE_ELEMENT;//Asset type: HTMLImageElement
    AT_JSON;//Asset type: JSON
    AT_TEXT;//Asset type: Text
    enqueue(assets_pack:Array<string>, asset_cb?:Function, pack_cb?:Function, progress_cb?:Function)
  }

  export class Anchors{
    attach_move_cb(obj, anchor_move_cb:Function);
    detach_move_cb(obj)
  }

  export class config{
    P_CUSTOM;//Custom quality profile: use engine defaults, allow customization.
    P_HIGH;//High quality profile: use all requested features.
    P_LOW;//Low quality profile: maximize engine performance.
    P_ULTRA;//Ultra quality profile: use all requested features and maximize quality.
    get(prop:string);//Get the value of the config property of the engine.
    //Get the path to the assets directory. Can be used when an application is developed inside the SDK.
    get_std_assets_path():string;
    //Reset all the engine's config properties to defaults.
    reset();
    //Set the value of the config property of the engine.
    set(prop:string, value:any);
  }

}
