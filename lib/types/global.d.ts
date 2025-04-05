// types/global.d.ts ou no topo do mongodb.ts
declare global {
    var mongoose: {
      conn: any;
      promise: Promise<any> | null;
    } | undefined;
  }
  
  // Isso faz com que o TypeScript
  