declare module "y-websocket/bin/utils" {
  export function setupWSConnection(
      conn: any,
      req: any,
      options?: { gc?: boolean }
  ): void;
}
