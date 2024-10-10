export default function AppearanceScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
      function parseJson(text) {
          try {
              return JSON.parse(text);
          } catch {
              return null;
          }
      }
      const preference = parseJson(localStorage.getItem('better-kpu-preferences'));
      const appearance = preference?.appearance ?? 'system';
      if (
        appearance === "dark" ||
        (appearance !== "light" &&
          window.matchMedia('(prefers-color-scheme: dark)').matches)
      ) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }  
    `,
      }}
    ></script>
  );
}
