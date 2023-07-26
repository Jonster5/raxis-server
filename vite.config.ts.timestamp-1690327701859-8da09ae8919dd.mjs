// vite.config.ts
import { defineConfig } from "file:///C:/Users/onlya/Desktop/raxis/raxis-server/node_modules/vite/dist/node/index.js";
import dts from "file:///C:/Users/onlya/Desktop/raxis/raxis-server/node_modules/vite-plugin-dts/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [dts({ insertTypesEntry: true })],
  build: {
    lib: {
      entry: "./src/main.ts",
      name: "raxis",
      fileName: (f, n) => `raxis-server-${n}.${f === "cjs" ? f : "js"}`,
      formats: ["es", "cjs"]
    },
    rollupOptions: {
      external: ["raxis", "http", "path", "ws"]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxvbmx5YVxcXFxEZXNrdG9wXFxcXHJheGlzXFxcXHJheGlzLXNlcnZlclwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcb25seWFcXFxcRGVza3RvcFxcXFxyYXhpc1xcXFxyYXhpcy1zZXJ2ZXJcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL29ubHlhL0Rlc2t0b3AvcmF4aXMvcmF4aXMtc2VydmVyL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgZHRzIGZyb20gJ3ZpdGUtcGx1Z2luLWR0cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG5cdHBsdWdpbnM6IFtkdHMoeyBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlIH0pXSxcblx0YnVpbGQ6IHtcblx0XHRsaWI6IHtcblx0XHRcdGVudHJ5OiAnLi9zcmMvbWFpbi50cycsXG5cdFx0XHRuYW1lOiAncmF4aXMnLFxuXHRcdFx0ZmlsZU5hbWU6IChmLCBuKSA9PiBgcmF4aXMtc2VydmVyLSR7bn0uJHtmID09PSAnY2pzJyA/IGYgOiAnanMnfWAsXG5cdFx0XHRmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuXHRcdH0sXG5cdFx0cm9sbHVwT3B0aW9uczoge1xuXHRcdFx0ZXh0ZXJuYWw6IFsncmF4aXMnLCAnaHR0cCcsICdwYXRoJywgJ3dzJ10sXG5cdFx0fSxcblx0fSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFvQjtBQUN0VixPQUFPLFNBQVM7QUFFaEIsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDM0IsU0FBUyxDQUFDLElBQUksRUFBRSxrQkFBa0IsS0FBSyxDQUFDLENBQUM7QUFBQSxFQUN6QyxPQUFPO0FBQUEsSUFDTixLQUFLO0FBQUEsTUFDSixPQUFPO0FBQUEsTUFDUCxNQUFNO0FBQUEsTUFDTixVQUFVLENBQUMsR0FBRyxNQUFNLGdCQUFnQixLQUFLLE1BQU0sUUFBUSxJQUFJO0FBQUEsTUFDM0QsU0FBUyxDQUFDLE1BQU0sS0FBSztBQUFBLElBQ3RCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDZCxVQUFVLENBQUMsU0FBUyxRQUFRLFFBQVEsSUFBSTtBQUFBLElBQ3pDO0FBQUEsRUFDRDtBQUNELENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
