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

  }
}
