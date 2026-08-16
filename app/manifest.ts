import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TEC Laguna",
    short_name: "TEC Laguna",
    description:
      "Aplicación no oficial para alumnos del Instituto Tecnológico de La Laguna.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#c38451",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
