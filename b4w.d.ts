declare module B4W{

  export function module_check(module_name:string):boolean;
  export function register(module_name:string, module_body:Function):void;
  //ns: Namespace for processed modules,Default is __B4W_DEF_NS
  export function require(module_name:string,ns?:string):Function;

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
}
