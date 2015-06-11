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

  export class Vec2{

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

  export class Quat4{

  }

  export class Mat2{

  }

  export class Mat3{
    //Calculates the adjugate of a mat3,伴随矩阵
    adjoint(a:Mat3, out:Mat3):Mat3;
    clone(a:Mat3):Mat3;
    copy(a:Mat3, out:Mat3):Mat3;
    create():Mat3;
    //Calculates the determinant of a mat3,行列式
    determinant(a:Mat3):number;
    //Returns Frobenius norm of a mat3，矩阵范数
    frob(a):number;
    //Copies the values from a mat2d into a mat3
    fromMat2d(a:Mat2, out):Mat3;
    //Copies the upper-left 3x3 values into the given mat3.
    fromMat4(a:Mat4, out:Mat3):Mat3;
    //Calculates a 3x3 matrix from the given quaternion
    fromQuat(q:Quat, out:Mat3):Mat3;
    //Creates a matrix from a given angle This is equivalent to (but much faster than):
    // mat3.identity(dest); mat3.rotate(dest, dest, rad);
    fromRotation(rad:number, out:Mat3):Mat3;
    //Creates a matrix from a vector scaling
    //This is equivalent to (but much faster than): mat3.identity(dest); mat3.scale(dest, dest, vec);
    fromScaling(v:Vec2, out:Mat3):Mat3;
    //Creates a matrix from a vector translation
    //This is equivalent to (but much faster than): mat3.identity(dest); mat3.translate(dest, dest, vec);
    fromTranslation(v:Vec2, out:Mat3):Mat3;
    //Set a mat3 to the identity matrix
    identity(out:Mat3):Mat3;
    invert(a:Mat3, out:Mat3):Mat3;
    mul();//Alias for mat3.multiply
    multiply(a:Mat3, b:Mat3, out:Mat3):Mat3;
    normalFromMat4(a:Mat4, out:Mat3):Mat3;
    rotate(a:Mat3, rad:number, out:Mat3):Mat3;
    scale(a:Mat3, v:Vec2, out:Mat3):Mat3;
    str(mat):string;
    translate(a:Mat3, v:Vec2, out:Mat3):Mat3;
    transpose(a:Mat3, out:Mat3):Mat3;
  }

  export class Mat4{
    adjoint(a:Mat4, out:Mat4):Mat4;
    clone(a:Mat4):Mat4;
    copy(a:Mat4, out:Mat4):Mat4;
    create():Mat4;
    determinant(a:Mat4):number;
    frob(a:Mat4):number;
    fromRotation(rad:number, axis:Vec3, out:Mat4):Mat4;
    fromRotationTranslation(q:Quat4, v:Vec3, out:Mat4):Mat4;
    fromScaling(v:Vec3, out:Mat4):Mat4;
    fromTranslation(v:Vec3, out:Mat4):Mat4;
    fromXRotation(rad:number, out:Mat4):Mat4;
    fromYRotation(rad:number, out:Mat4):Mat4;
    fromZRotation(rad:number, out:Mat4):Mat4;
    //Generates a frustum matrix with the given bounds
    frustum(left:number, right:number, bottom:number,
       top:number, near:number, far:number, out:number):Mat4;
    identity(out:Mat4):Mat4;
    invert(a:Mat4, out:Mat4):Mat4;
    lookAt(eye:Vec3, center:Vec3, up:Vec3, out:Mat4):Mat4;
    mul();//Alias for mat3.multiply
    multiply(a:Mat4, b:Mat4, out:Mat4):Mat4;
    //Generates a orthogonal projection matrix with the given bounds
    ortho(left:number, right:number, bottom:number, top:number, near:number, far:number, out:Mat4):Mat4;
    //Generates a perspective projection matrix with the given bounds
    perspective(fovy:number, aspect:number, near:number, far:number, out:Mat4):Mat4;
    //Generates a perspective projection matrix with the given field of view.
    //This is primarily useful for generating projection matrices to be used with the still experiemental WebVR API.
    perspectiveFromFieldOfView(fov:number, near:number, far:number, out:Mat4):Mat4;
    //Rotates a mat4 by the given angle around the given axis
    rotate(a:Mat4, rad:number, axis:Vec3, out:Mat4):Mat4;
    //Rotates a matrix by the given angle around the X axis
    rotateX(a:Mat4, rad:number, out:Mat4):Mat4;
    //Rotates a matrix by the given angle around the Y axis
    rotateY(a:Mat4, rad:number, out:number):Mat4;
    rotateZ(a:Mat4, rad:number, out:Number):Mat4;
    scale(a:Mat4, v:Vec3, out:number):Mat4;
    str(mat:Mat4):string;
    //Translate a mat4 by the given vector
    translate(a:Mat4, v:Vec3, out:Mat4):Mat4;
    transpose(a:Mat4, out:Mat4):Mat4;

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

  export class constraints{
    //Attach the object to the other object using a copy translation constraint.
    //The child object will move together with its parent, but will not rotate.
    //Note that the offset is specified in the world space. Example: a light source attached to the character.
    append_copy_trans(obj, target, offset:Float32Array);
    //Attach the object to the other object using a follow constraint.
    //The child object will track and follow its parent position.
    //Example: a follow-style camera view for the character.
    append_follow(obj, target:Float32Array, dist_min:number, dist_max:number);
    //Attach the EYE camera to the object using a semi-soft constraint.
    //The camera will smoothly follow the object's rear.
    //Example: third-person character or vehicle views.
    append_semi_soft_cam(obj, target, offset:Float32Array, softness?:number);
    //Attach the object to the other object using a semi-stiff constraint.
    //The child object will move and rotate together with its parent,
    //but it will be still possible to rotate it independently in the parent's local space. Example: a tank turret.
    append_semi_stiff(obj, target, offset:Float32Array, rotation_offset?:Float32Array);
    //Attach the EYE camera to the object using a semi-stiff constraint.
    // Also apply rotation limits to the camera.
    // The camera will move and rotate together with its parent,
    // but it will be still possible to rotate it independently in the parent's local space.
    // The camera's UP vector will be preserved. Example: first-person vehicle view.
    append_semi_stiff_cam(obj, target, offset:Float32Array, rotation_offset:Float32Array, clamp_left:number, clamp_right:number, clamp_up:number, clamp_down:number);
    //Attach the object to the other object or to the armature bone using a stiff constraint.
    //The child object will move, rotate and scale together with its parent.
    //Examples: a sword is parented to the character's hand; the character is sitting in a vehicle.
    append_stiff(obj, target, offset:Float32Array, rotation_offset?:Float32Array, scale_offset?:number);

    // follow the character but will not be rotated with the camera.
    // It will be still possible to rotate it independently from the parent.
    append_stiff_trans(obj, target, offset:Float32Array);

    //保持缩放的独立
    append_stiff_trans_rot(obj, target, offset:Float32Array, rotation_offset?:Float32Array);

    //Append a stiff viewport constraint.
    append_stiff_viewport(obj, camobj, x_rel, y_rel, dist);

    //Make the object "looking" at the target object or the position.
    append_track(obj, target:any);
    //Get object's parent object.
    get_parent(obj);
    //Remove the object's constraint (if any).
    remove(obj);
  }


  export class container{
    get_canvas():Element;
    get_container():Element;
    insert_to_container(obj:Element, behavior:string);
  }

  export class Sensor{

  }

  export class controls{
    CT_CONTINUOUS
    CT_LEVEL
    CT_SHOT
    CT_TRIGGER
    KEY_1
    KEY_2
    KEY_3
    KEY_4
    KEY_5
    KEY_6
    KEY_7
    KEY_8
    KEY_9
    KEY_A
    KEY_ALT
    KEY_B
    KEY_BACK_SLASH
    KEY_BACKSPACE
    KEY_C
    KEY_CAPSLOCK
    KEY_COMMA
    KEY_CTRL
    KEY_D
    KEY_DASH
    KEY_DEC_POINT
    KEY_DOWN
    KEY_E
    KEY_ENTER
    KEY_EQUAL_SIGN
    KEY_ESC
    KEY_F
    KEY_FORWARD_SLASH
    KEY_G
    KEY_GRAVE_ACCENT
    KEY_H
    KEY_I
    KEY_J
    KEY_K
    KEY_L
    KEY_LEFT
    KEY_LEFT_SQ_BRACKET
    KEY_M
    KEY_N
    KEY_NUM0
    KEY_NUM1
    KEY_NUM2
    KEY_NUM3
    KEY_NUM4
    KEY_NUM5
    KEY_NUM6
    KEY_NUM7
    KEY_NUM8
    KEY_NUM9
    KEY_O
    KEY_P
    KEY_PAUSE
    KEY_PERIOD
    KEY_Q
    KEY_R
    KEY_RIGHT
    KEY_RIGHT_SQ_BRACKET
    KEY_S
    KEY_SEMI_COLON
    KEY_SHIFT
    KEY_SINGLE_QUOTE
    KEY_SPACE
    KEY_T
    KEY_TAB
    KEY_U
    KEY_UP
    KEY_V
    KEY_W
    KEY_X
    KEY_Y
    KEY_Z
    PL_MULTITOUCH_MOVE_PAN
    PL_MULTITOUCH_MOVE_ZOOM
    PL_SINGLE_TOUCH_MOVE

    //Check whether the object has the manifold attached.
    check_sensor_manifold(obj, id:string):boolean;
    //Check whether the object has any manifolds attached.
    check_sensor_manifolds(obj):boolean;
    //Create a collision impulse sensor 碰撞
    create_collision_impulse_sensor(obj):Sensor;
    //Create a collision sensor. Detects collisions between the object and the entities
    // (objects or physics materials) with the specified collision ID.
    //If the collision ID is not specified, the sensor will detect collisions with any entities.
    create_collision_sensor(obj, collision_id:string, need_collision_pt:boolean):Sensor;
    //Create a custom sensor.
    //A custom sensor can be controlled manually by using the get_custom_sensor() and set_custom_sensor() methods.
    create_custom_sensor(value:number):any;
    //Create an elapsed sensor. The sensor's value is the time elapsed from the previous frame.
    create_elapsed_sensor():Sensor;
    //Create a gyroscope angle sensor.
    // The sensor's payload stores the Euler angles of orientation of a mobile device.
    create_gyroscope_angles_sensor():Sensor;
    //Create a gyroscope delta sensor.
    //The sensor's payload stores the differences between Euler angles of the current orientation and the previous orientation of a mobile device.
    create_gyroscope_angles_sensor():any;

    //Convenience function: creates a manifold coupled with a single keyboard sensor.
    // Can be used to quickly create a single-key functionality.
    create_kb_sensor_manifold(obj, id:string, type:number, key:number, callback:Function, callback_param:any);
    //Create a keyboard sensor.
    create_keyboard_sensor(key:number):Sensor;
    //Create a motion sensor. The sensor's value is 1 if the object is in motion.
    create_motion_sensor(obj, threshold?:number, rotation_threshold?:number):Sensor;
    create_mouse_click_sensor():Sensor;
    //axis: Coordinate(s) to track: "X", "Y", "XY"
    create_mouse_move_sensor(axis?:string):Sensor;
    //Create a mouse wheel sensor. The sensor's value is 1 for a single wheel notch scrolled away from the user.
    create_mouse_wheel_sensor():Sensor;
    //The sensor casts a ray between the start_offset and end_offset positions.
    create_ray_sensor(obj, start_offset:Float32Array, end_offset:Float32Array,
      use_local_coords?:boolean, collision_id?:boolean):Sensor;
    //Create a selection sensor for the object.
    //The sensor's value becomes 1 when the object is selected by the user.
    create_selection_sensor(obj, auto_release?:boolean):Sensor;
    create_sensor_lock(sensor, lock_sensors:Array<Sensor>, lock_logic_fun:Function);
    create_sensor_manifold(obj, id:string, type:number, sensors:Array<Sensor>, logic_fun:Function, callback:Function, callback_param:any);
    create_timeline_sensor():Sensor;
    create_timer_sensor(period:number, do_repeat?:boolean):Sensor;

    create_touch_move_sensor(axis?:string):Sensor;
    create_touch_zoom_sensor():Sensor;
    create_vertical_velocity_sensor(obj, threshold:number):Sensor;
    get_custom_sensor(sensor:Sensor):number;
    get_sensor_payload(obj, manifold_id:string, num:number);
    get_sensor_value(obj, manifold_id:string, num:number);
    register_device_orientation();
    register_keyboard_events(element:Element, prevent_default:boolean);
    register_mouse_events(element:Element, prevent_default:boolean, allow_element_exit?:boolean);
    register_touch_events(element:Element, prevent_default:boolean);
    register_wheel_events(element:Element, prevent_default:boolean);
    remove_sensor_lock(sensor:Sensor);
    remove_sensor_manifold(obj, id:string);
    remove_sensor_manifolds(obj);
    //Reset controls for all the objects.
    reset();
    reset_timer_sensor(obj, manifold_id:string, num:number, period:number);
    set_custom_sensor(sensor, value:number);
    unregister_device_orientation()
    unregister_keyboard_events(element:Element);
    unregister_mouse_events(element:Element);
    unregister_touch_events(element:Element);
    unregister_wheel_events(element:Element);

  }

  export class data{
    //Check if the engine primary data is loaded (detect the last loading stage).
    is_primary_loaded():boolean;
    //Load data from the json file exported from Blender.
    load(path, loaded_cb?:Function, stageload_cb?:Function,
       wait_complete_loading?:Function, load_hidden?:Function):number;
    //Set the root which contains the resources, for debug purposes. Enables the checking of loading paths,
    // so if the resources are not loaded from the app root, there will be a warning in m_print.
    set_debug_resources_root(debug_resources_root);

    //Unload the previously loaded data.
    unload(data_id:number);
  }

  export class debug{
    assert_constants();
    check_finite();
    controls_info();
    fbmsg();
    //Store the callback function result as a flashback message.
    fbres();
    geometry_stats();
    make_camera_frustum_shot();
    make_light_frustum_shot();
    msg();
    mute_music();
    num_draw_calls();
    num_render_targets();
    num_shaders();
    num_textures();
    num_triangles();
    num_vertices();
    object_distance();
    object_info(name);
    object_info(name);
    physics_id(id);
    physics_stats();
    plot_telemetry();
    print_telemetry();
    scenegraph_to_dot();
    set_debug_params();
    visible_objects();
  }

  export class gyroscope{
    enable_camera_rotation();
  }

  export class hub{
    //Draw the mixer strip. Used by mixer addon.
    draw_mixer_strip();
    //Plot the array.
    plot_array(header:string, slot:number, arr:Float32Array,
       arg_min:number, arg_max:number, val_min:number, val_max:number);
  }

  export class lights{
    get_lamps(lamps_type?:string):Array<any>;//Lamps type ("POINT", "SPOT", "SUN", "HEMI")
    get_light_params(lamp_obj):any;
    get_light_type(lamp_obj):string;
    get_sun_params():any;
    set_date(date:Date);
    set_day_time(time:number);
    set_light_params(lamp_obj, light_params:any);
    set_max_sun_angle(angle:number);
    set_sun_params(sun_params:any);
  }

  export class main{

    //Append callback to be executed every frame.
    append_loop_cb(callback:Function);
    //Remove the callback for the FPS counter
    clear_fps_callback();
    //Deprecated: Use clear_render_callback() instead
    clear_on_before_render_callback();
    clear_render_callback()
    //Return the main canvas element.
    get_canvas_elem():Element;
    //Return the main canvas element.
    global_timeline();
    //Create the WebGL context and initialize the engine.
    init(elem_canvas_webgl, elem_canvas_hud?:Element);
    is_paused():boolean;
    pause()
    redraw()
    remove_loop_cb(callback:Function);
    //Reset the engine. Unloads the scene and releases the engine's resources.
    reset()

    resize(width:number, height:number, update_canvas_css?:boolean);
    resume();

    //Whether to perform the checks of WebGL errors during rendering or not.
    // Note: additional checks can slow down the engine.
    set_check_gl_errors(val:boolean);
    set_fps_callback(fps_cb:Function);
    //Deprecated: Use set_render_callback() instead
    set_on_before_render_callback();
    //Set the rendering callback which is executed for every frame
    set_render_callback(callback:Function);
  }

  export class material{
    check_specular_hardness(obj, mat_name:string):boolean;
    check_specular_intensity(obj, mat_name:string):boolean;
    get_alpha_factor(obj, mat_name:string):number;
    get_ambient_factor(obj, mat_name:string):number;
    get_diffuse_color(obj, mat_name:string):Float32Array;
    get_diffuse_color_factor(obj, mat_name:string):Float32Array;
    get_diffuse_intensity(obj, mat_name:string):number;
    get_emit_factor(obj, mat_name:string):number;

    get_material_extended_params(obj, mat_name:string):any;
    get_materials_names(obj):Array<string>;

    get_specular_color(obj, mat_name:string):Float32Array;
    get_specular_hardness(obj, mat_name:string):number;
    get_specular_intensity(obj, mat_name:string):number;
    get_water_material_params(obj, water_mat_name:string):any;
    inherit_material(obj_from, mat_from_name:string, obj_to, mat_to_name:string);
    set_alpha_factor(obj, mat_name:string, alpha_factor:number);
    set_ambient_factor(obj, mat_name:string, ambient_factor:number);
    set_diffuse_color(obj, mat_name:string, color:Float32Array);
    set_diffuse_color_factor(obj, mat_name:string, diffuse_color_factor:Float32Array);
    set_diffuse_intensity(obj, mat_name:string, intensity:Float32Array);
    set_emit_factor(obj, mat_name:string, emit_factor:Float32Array);
    set_material_params(obj, mat_name:string, mat_params:any);
    set_specular_color(obj, mat_name:string, color:Float32Array);
    set_specular_hardness(obj, mat_name:string, hardness:number);
    set_specular_intensity(obj, mat_name:string, intensity:number);
    set_water_material_params(obj, water_mat_name:string, water_mat_params:any);
  }

  export class mixer{
    enable_mixer_controls();
  }

  export class mouse{
    check_pointerlock(elem:Element):boolean;
    disable_mouse_hover_glow();
    disable_mouse_hover_outline();
    enable_mouse_hover_glow();
    enable_mouse_hover_outline();
    exit_mouse_drag(elem:Element);
    exit_pointerlock();
    get_coords_x(event:MouseEvent);
    get_coords_y(event:MouseEvent);
    request_mouse_drag(elem:Element, use_mouse_control_cb?:Function);
    request_pointerlock(elem:Element, enabled_cb?:Function, disabled_cb?:Function, mouse_move_cb?:Function, use_mouse_control_cb?:Function);
  }

  export class nla{
    check_nla()
    check_nla()
    get_frame_end()
    get_frame_end()
    get_nla_frame():number;
    play_nla()
    play_nla()
    set_nla_frame(frame)
    stop_nla()
  }



  export class Graph{
    path:Array<Array<number>>;//	A list of [x,y,z] points NPC will be moving around.
    delay:number;//	Time delay before each path step.
    actions:any;//	Actions for every movement type (move, idle, etc).
    obj:any;//	Animated object ID.
    rig:any;//	Armature object ID.
    collider:any;//	Object	Collider object ID which will be used for collision detection.
    empty:any;	//The corresponding empty object.
    speed:number;//	Movement speed.
    rot_speed:number;//	Rotation speed.
    random:boolean;//	Boolean	Determines whether the object will perform random moves or not.
    type:boolean;//	Number	NPC movement type (NT_WALKING, NT_FLYING, etc).
  }

  export class npc_ai{
    NT_FLYING;
    NT_SWIMMING;
    NT_WALKING;
    disable_animation();
    enable_animation();
    npc_ai(graph:Graph);
  }

  export class particles{
    set_factor(obj, psys_name, factor);
    set_normal_factor(obj, psys_name, nfactor);
    set_size(obj, psys_name, size);
  }

  export class physics{
    CM_CLIMB;
    CM_FLY;
    CM_RUN;
    CM_WALK;
    //Append a new async collision test to the given object.
    append_collision_test(obj, collision_id:string, callback:Function, need_collision_point?:boolean);
    //Append new async ray test to given object.
    append_ray_test(obj, collision_id:string, from:Float32Array, to:Float32Array, local_coords:boolean, callback:Function);
    //Apply a new async collision impulse test to the given object.
    apply_collision_impulse_test(obj, callback:Function);
    //Apply physics constraint.
    apply_constraint(
       pivot_type:string,//Pivot type
       obj_a,
       trans_a:Float32Array,//Translation of pivot frame relative to A
       quat_a:Float32Array,//Rotation of pivot frame relative to A
       obj_b,
       trans_b:Float32Array,//Translation of pivot frame relative to B
       quat_b:Float32Array,//Rotation of pivot frame relative to B
       limits,
       stiffness?:Float32Array,//6-dimensional vector with constraint stiffness
       damping?:Float32Array//6-dimensional vector with constraint damping
    )
    apply_force(obj, fx_local:number, fy_local:number, fz_local:number);//力
    apply_torque(obj, tx_local:number, ty_local:number, tz_local:number);//转矩
    apply_velocity(obj, vx_local:number, vy_local:number, vz_local:number);//速度,local space
    apply_velocity_world(obj, vx:number, vy:number, vz:number);//速度, world space
    character_jump(obj);//Make the character jump
    character_rotation_inc(obj, h_angle:number, v_angle:number);//Increment the character rotation
    clear_collision_impulse_test(obj);
    disable_simulation(obj);
    enable_simulation(obj);
    get_vehicle_brake(obj):number;
    get_vehicle_name(obj);
    get_vehicle_speed(obj):number;
    get_vehicle_steering(obj):number;
    get_vehicle_throttle(obj);
    has_dynamic_physics(obj):boolean;
    has_physics(obj):boolean;
    has_simulated_physics(obj):boolean;
    is_character(obj):boolean;
    is_vehicle_chassis(obj);
    is_vehicle_hull(obj);

    //Pull object A to constraint pivot with object B.
    pull_to_constraint_pivot(obj_a, trans_a:Float32Array, quat_a:Float32Array,
      obj_b, trans_b:Float32Array, quat_b:Float32Array);
    remove_collision_test(obj, collision_id)
    remove_constraint(obj_a)
    remove_ray_test(obj, collision_id, from, to, local_coords)
    reset_damping(obj);
    set_character_fly_velocity(obj, velocit:number);
    set_character_move_dir(obj, forw:number, side:number);
    set_character_move_type(obj, type:number);// (0 - walk, 1 - run, 2 - vertical climb)
    set_character_rotation(obj, angle_h:number, angle_v:number);
    set_character_rotation_h(obj, angle:number);
    set_character_rotation_quat(obj, quat:Float32Array);
    set_character_rotation_v(obj, angle:number);
    set_character_run_velocity(obj, velocity:number);
    set_character_walk_velocity(obj, velocity:number);
    set_damping(obj, damping:number, rotation_damping:number);
    set_gravity(obj, gravity:number);
    set_transform(obj, trans:Float32Array, quat:Float32Array);
    sync_transform(obj)
    vehicle_brake(obj, brake_force:number);
    vehicle_brake_inc(obj, brake_force:number);
    vehicle_steer(obj, steering_value:number);
    vehicle_steer_inc(obj, steering_value:number, dir:number);
    vehicle_throttle(obj, engine_force:number);
    vehicle_throttle_inc(obj, engine_force:number, dir:number);
  }

  export class preloader{
    create_advanced_preloader(options:{
      canvas_container_id:string;//	Canvas container ID.
      background_container_id:string;//	Background container ID.
      preloader_bar_id:string;//	Preloader bar ID.
      fill_band_id:string;//	Preloader band ID.
      preloader_caption_id:string;//	Preloader caption ID.
      preloader_container_id:string;//Preloader container ID.
      img_width:number;//		Device image width.
      preloader_width:number;//	Preloader width.
    });
    create_rotation_preloader(options:{
      canvas_container_id:string;//			Canvas container ID.
      background_container_id?:string;//Background container ID.
      bg_color?:string;//Background color.
      frame_bg_color?:string;//Frame background color.
      frame_class?:string;//CSS frame class.
      anim_elem_class?:string;//Animated element class.
    });
    create_simple_preloader(options:{
      canvas_container_id:string;//	String		Canvas container ID.
      background_container_id:string;//Background container ID.
      bg_color?:string;//Background color.
      bar_color?:string;//Load bar color.
    })
    update_preloader(percentage:number);
  }

}
