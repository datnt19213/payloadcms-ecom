/** @type {import('tailwindcss').Config} */

const { plugins } = require('chart.js');

module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      cursor: {
        "select": "url('/src/media/icons/cursor_is_select.cur')",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeinnozoom: {
          "0%": {opacity: "0"},
          "50%": {opacity: "1"},
        },
        fadeoutnozoom: {
          "0%": {opacity: "1"},
          "50%": {opacity: "0"},
        },
        fadeinzoom: {
          "0%": {opacity: "0", scale: "0.7"},
          "50%": {opacity: "1", scale: "1"},
        },
        fadeoutzoom: {
          "0%": {opacity: "1",scale: "1"},
          "50%": {opacity: "0",scale: "0.7"},
        },
        slideleftright: {
          "0%": {transform: "translateX(-200%)", opacity: "0"},
          "25%": {transform: "translateX(-200%)", opacity: "1"},
          "80%": {transform: "translateX(0%)"},
        },
        sliderightleft: {
          "0%": {transform: "translateX(200%)", opacity: "0"},
          "25%": {transform: "translateX(200%)", opacity: "1"},
          "80%": {transform: "translateX(0%)"},
        },
        slidetopbot: {
          "0%": {transform: "translateY(-200%)", opacity: "0"},
          "25%": {transform: "translateY(-200%)", opacity: "1"},
          "80%": {transform: "translateY(0%)"},
        },
        slidebottop: {
          "0%": {transform: "translateY(200%)", opacity: "0"},
          "25%": {transform: "translateY(200%)", opacity: "1"},
          "80%": {transform: "translateY(0%)"},
        },
        texttrackingexpand: {
          "0%": {
            "letter-spacing": "-0.5em",
            opacity: "0",
          },
          "50": {
            "letter-spacing": "0.025em",
            opacity: "1",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        fadeinnozoom: "fadeinnozoom 0.7s ease-in-out alternate",
        fadeoutnozoom: "fadeoutnozoom 0.7s ease-in-out alternate",
        fade: "fadeinzoom 0.7s ease-in-out alternate",
        fadepop: "fadeinzoom 0.7s cubic-bezier(.62,-0.29,.38,1.23) alternate",
        slideleftright:
          "slideleftright 0.7s cubic-bezier(.75,-0.71,.19,1.89) alternate",
        sliderightleft:
          "sliderightleft 0.7s cubic-bezier(.75,-0.71,.19,1.89) alternate",
        slidetopbot:
          "slidetopbot 0.7s cubic-bezier(.75,-0.71,.19,1.89) alternate",
        slidebotttop:
          "slidebottop 0.7s cubic-bezier(.75,-0.71,.19,1.89) alternate",
        slowfade: "fadein 1.3s ease-in-out alternate",
        slowfadepop: "fadein 1.3s ease-in-out alternate",
	      slowfadenozoom: "fadeinnozoom 1.3s ease-in-out alternate",
        slowfadepopnozoom: "fadeinnozoom 1.3s ease-in-out alternate",
        slowslideleftright:
          "slideleftright 1.3s ease-in-out alternate",
        slowsliderightleft:
          "sliderightleft 1.3s ease-in-out alternate",
        slowslidetopbot:
          "slidetopbot 1.3s ease-in-out alternate",
        slowslidebottop:
          "slidebottop 1.3s ease-in-out alternate",
        slowtexttrackingexpand:
          "texttrackingexpand 1.5s ease-in-out alternate",
      },
      boxShadow: {
        top: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
        around: "0 0px 6px -1px rgba(0, 0, 0, 0.1)",
        light: '0 2px 4px rgba(0, 0, 0, 0.1)',
        dark: '0 4px 8px rgba(0, 0, 0, 0.3)',
        colored: '0 4px 6px rgba(255, 0, 0, 0.4)',
      },
      backgroundColor: {
        SGreen: "#28a745",
        SRed: "#dc3545",
        SYellow: "#ffc107",
        SGray: "#6c757d",
        SBlue: "#007bff",
        SLightGreen: "#8bc34a",
        SDarkRed: "#c82333",
        SLightGray: "#a7a7a7",
        "pastel-purple": "#9376E0",
        "pastel-blue": "#BBE9FF",
        "pastel-green": "#7ED7C1",
        "pastel-red": "#FFC6AC",
        "pastel-gray": "#EEEEEE",
      }
    },
  },
  plugins: [require("tailwindcss-animate"), require('tailwind-scrollbar'),require('@tailwindcss/typography')],
}