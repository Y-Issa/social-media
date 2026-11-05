import { extendTheme, theme as baseTheme } from "@chakra-ui/react";

// "Broadsheet" — see DESIGN.md. Every color is a semantic token with a
// light and dark value; components only ever reference token names.

const palette = {
  bg: ["#F4F1EA", "#121311"],
  surface: ["#FBFAF6", "#1A1B18"],
  "surface-raised": ["#FFFFFF", "#23251F"],
  border: ["#E2DDD2", "#2C2E29"],
  "border-strong": ["#C9C2B3", "#3A3D36"],
  "text-primary": ["#1A1915", "#ECE9E1"],
  "text-secondary": ["#4A463E", "#B9B5AA"],
  "text-muted": ["#6E685C", "#97928A"],
  accent: ["#1F7A4D", "#5CC48A"],
  "accent-hover": ["#17603C", "#7AD3A0"],
  "on-accent": ["#FFFFFF", "#0B1A12"],
  "accent-subtle": ["#E2EDE5", "#1C2E23"],
  danger: ["#B42318", "#F07C6C"],
  "danger-subtle": ["#F8E5E2", "#3A201C"],
  success: ["#2E7D32", "#6FCF8E"],
  warning: ["#9A5B00", "#E2B25C"],
  overlay: ["rgba(26, 25, 21, 0.44)", "rgba(0, 0, 0, 0.6)"],
};

const pair = ([light, dark]) => ({ default: light, _dark: dark });

const tokens = Object.fromEntries(
  Object.entries(palette).map(([name, value]) => [name, pair(value)])
);

// Green ramp used by colorScheme="primary" and legacy primary.* references.
// Dark mode is inverted around the accent so Chakra's default dark-mode
// shades (.200/.300) still land on the accent.
const primaryLight = {
  50: "#E2EDE5",
  100: "#C5DCCB",
  200: "#9CC4A8",
  300: "#6BA680",
  400: "#3F8C61",
  500: "#1F7A4D",
  600: "#17603C",
  700: "#11492E",
  800: "#0B3420",
  900: "#062014",
};
const primaryDark = {
  50: "#1C2E23",
  100: "#24402F",
  200: "#5CC48A",
  300: "#7AD3A0",
  400: "#4FAF7A",
  500: "#5CC48A",
  600: "#7AD3A0",
  700: "#9FE0BA",
  800: "#C4ECD4",
  900: "#E2F6EA",
};
const primaryTokens = Object.fromEntries(
  Object.keys(primaryLight).map((k) => [
    `primary.${k}`,
    pair([primaryLight[k], primaryDark[k]]),
  ])
);

// Legacy aliases still used by components that haven't been restyled yet.
const legacyBg = {
  50: palette.surface,
  100: palette.surface,
  200: palette.bg,
  300: palette["surface-raised"],
  400: palette.border,
  500: palette["border-strong"],
  600: palette["text-muted"],
  700: palette["text-secondary"],
  800: palette["text-primary"],
  900: palette["text-primary"],
};
const legacyText = {
  50: palette["text-primary"],
  100: palette["text-primary"],
  200: palette["text-secondary"],
  300: palette["text-muted"],
  400: palette["text-muted"],
  500: palette["text-muted"],
  600: palette.border,
  700: palette.border,
  800: palette.surface,
  900: palette.surface,
};
// Chakra 2.4 doesn't flatten nested semantic tokens, so use dotted keys
// ("bgColor.50") which resolve exactly like palette shades.
const flatPairs = (prefix, obj, toPair = pair) =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [`${prefix}.${k}`, toPair(v)])
  );

const ease = "cubic-bezier(.2,.8,.2,1)";
const focusRing = "0 0 0 3px var(--chakra-colors-accent-subtle)";

// ---------- Button ----------
const btnPrimary = {
  bg: "accent",
  color: "on-accent",
  _hover: { bg: "accent-hover", _disabled: { bg: "accent" } },
  _active: { bg: "accent-hover" },
};
const btnSecondary = {
  bg: "transparent",
  color: "text-primary",
  border: "1px solid",
  borderColor: "border-strong",
  _hover: { bg: "surface-raised", _disabled: { bg: "transparent" } },
  _active: { bg: "surface-raised" },
};
const btnGhost = {
  bg: "transparent",
  color: "text-muted",
  _hover: { bg: "surface-raised", color: "text-primary" },
  _active: { bg: "surface-raised", color: "text-primary" },
};
const btnDanger = {
  bg: "transparent",
  color: "danger",
  _hover: { bg: "danger-subtle" },
  _active: { bg: "danger-subtle" },
};
const btnDangerSolid = {
  bg: "danger",
  color: "on-accent",
  _hover: { opacity: 0.9, _disabled: { opacity: 0.4 } },
};
const isRed = (c) => c === "red" || c === "danger";

const Button = {
  baseStyle: {
    borderRadius: "sm",
    fontWeight: 600,
    lineHeight: 1.2,
    transitionProperty: "common",
    transitionDuration: "120ms",
    transitionTimingFunction: ease,
    _focusVisible: { boxShadow: focusRing, outline: "1px solid var(--chakra-colors-accent)" },
  },
  sizes: {
    lg: { h: "40px", minW: "40px", fontSize: "15px", px: 5 },
    md: { h: "36px", minW: "36px", fontSize: "14px", px: 4 },
    sm: { h: "32px", minW: "32px", fontSize: "13px", px: 3 },
    xs: { h: "24px", minW: "24px", fontSize: "12px", px: 2 },
  },
  variants: {
    primary: btnPrimary,
    secondary: btnSecondary,
    ghost: (props) => (isRed(props.colorScheme) ? btnDanger : btnGhost),
    danger: btnDanger,
    // colorScheme="primary" (default) solid looks like `primary`.
    solid: (props) => {
      if (props.colorScheme === "primary") return btnPrimary;
      if (isRed(props.colorScheme)) return btnDangerSolid;
      if (props.colorScheme === "gray") return { ...btnSecondary, border: "none", bg: "surface-raised", _hover: { bg: "border" } };
      return baseTheme.components.Button.variants.solid(props);
    },
    outline: (props) =>
      isRed(props.colorScheme) ? { ...btnSecondary, color: "danger", _hover: { bg: "danger-subtle" } } : btnSecondary,
    link: {
      color: "accent",
      fontWeight: 500,
      p: 0,
      h: "auto",
      minW: 0,
      _hover: { textDecoration: "underline", color: "accent-hover" },
      _active: { color: "accent-hover" },
    },
    unstyled: baseTheme.components.Button.variants.unstyled,
  },
  defaultProps: { variant: "solid", size: "md", colorScheme: "primary" },
};

// ---------- Inputs ----------
const fieldStyle = {
  bg: "surface",
  border: "1px solid",
  borderColor: "border",
  borderRadius: "sm",
  color: "text-primary",
  transition: `border-color 120ms ${ease}, box-shadow 120ms ${ease}`,
  _placeholder: { color: "text-muted" },
  _hover: { borderColor: "border-strong" },
  _focusVisible: { borderColor: "accent", boxShadow: focusRing, zIndex: 1 },
  _invalid: { borderColor: "danger", boxShadow: "none" },
  _disabled: { opacity: 0.6, cursor: "not-allowed" },
  _readOnly: { boxShadow: "none" },
};
const Input = {
  variants: {
    outline: {
      field: fieldStyle,
      addon: { bg: "surface-raised", borderColor: "border", borderRadius: "sm" },
    },
    flushed: {
      field: {
        bg: "transparent",
        borderBottom: "1px solid",
        borderColor: "border",
        borderRadius: 0,
        _placeholder: { color: "text-muted" },
        _focusVisible: { borderColor: "accent", boxShadow: "none" },
      },
    },
  },
  sizes: {
    md: { field: { h: "40px", fontSize: "15px", px: 3 }, addon: { h: "40px" } },
    sm: { field: { h: "32px", fontSize: "13px", px: 2.5, borderRadius: "sm" } },
  },
  defaultProps: { variant: "outline", size: "md" },
};
const Textarea = {
  variants: {
    outline: { ...fieldStyle, py: 2 },
    unstyled: { bg: "transparent", _placeholder: { color: "text-muted" } },
  },
  sizes: { md: { fontSize: "15px", px: 3 } },
  defaultProps: { variant: "outline", size: "md" },
};

// ---------- Surfaces ----------
const floating = {
  bg: "surface-raised",
  border: "1px solid",
  borderColor: "border",
  boxShadow: "float",
};

const Card = {
  baseStyle: {
    container: {
      "--card-bg": "colors.surface",
      color: "text-primary",
      borderRadius: "md",
    },
  },
  variants: {
    elevated: {
      container: {
        boxShadow: "none",
        border: "1px solid",
        borderColor: "border",
        _dark: { "--card-bg": "colors.surface" },
      },
    },
    outline: { container: { borderColor: "border" } },
  },
};

const Menu = {
  baseStyle: {
    list: {
      "--menu-bg": "colors.surface-raised",
      "--menu-shadow": "shadows.float",
      _dark: {
        "--menu-bg": "colors.surface-raised",
        "--menu-shadow": "shadows.float",
      },
      border: "1px solid",
      borderColor: "border",
      borderRadius: "md",
      py: 1,
      minW: "200px",
      color: "text-primary",
      zIndex: "dropdown",
    },
    item: {
      fontSize: "14px",
      h: "36px",
      px: 3,
      gap: 2,
      transition: `background 120ms ${ease}`,
      _hover: { "--menu-bg": "colors.bg", _dark: { "--menu-bg": "colors.bg" } },
      _focus: { "--menu-bg": "colors.bg", _dark: { "--menu-bg": "colors.bg" } },
      _active: { "--menu-bg": "colors.border", _dark: { "--menu-bg": "colors.border" } },
      _expanded: { "--menu-bg": "colors.bg", _dark: { "--menu-bg": "colors.bg" } },
    },
    divider: { borderColor: "border", opacity: 1, my: 1 },
    groupTitle: { fontFamily: "mono", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.06em", color: "text-muted", fontWeight: 500 },
    command: { fontFamily: "mono", fontSize: "12px", color: "text-muted", opacity: 1 },
  },
};

const Modal = {
  baseStyle: {
    overlay: { bg: "overlay" },
    dialog: {
      ...floating,
      bg: "surface",
      _dark: { bg: "surface" },
      color: "text-primary",
      borderRadius: "md",
      mx: 4,
    },
    header: { fontSize: "20px", lineHeight: "26px", fontWeight: 600, px: 5, pt: 5, pb: 2 },
    body: { px: 5, py: 2 },
    footer: { px: 5, pt: 3, pb: 5, gap: 2 },
    closeButton: { top: 4, insetEnd: 4, borderRadius: "sm", color: "text-muted", _hover: { bg: "surface-raised", color: "text-primary" } },
  },
};

// Toast/alert: surface-raised, hairline border, 3px left bar in status color.
const statusToken = { success: "success", error: "danger", warning: "warning", info: "accent", loading: "accent" };
const toastVariant = (props) => {
  const bar = `colors.${statusToken[props.status] || "accent"}`;
  return {
    container: {
      "--alert-bg": "colors.surface-raised",
      "--alert-fg": bar,
      _dark: { "--alert-bg": "colors.surface-raised", "--alert-fg": bar },
      color: "text-primary",
      border: "1px solid",
      borderColor: "border",
      borderInlineStartWidth: "3px",
      borderInlineStartColor: "var(--alert-fg)",
      borderRadius: "md",
      boxShadow: "float",
      fontSize: "14px",
      lineHeight: "20px",
      py: 3,
      ps: 3,
    },
    title: { fontWeight: 600, fontSize: "14px", lineHeight: "20px" },
    description: { fontSize: "14px", lineHeight: "20px", color: "text-secondary" },
    icon: { color: "var(--alert-fg)", w: 4, h: 5 },
    spinner: { color: "var(--alert-fg)" },
  };
};
const Alert = {
  variants: {
    toast: toastVariant,
    solid: toastVariant,
    "left-accent": toastVariant,
    subtle: (props) => ({
      ...toastVariant(props),
      container: { ...toastVariant(props).container, boxShadow: "none", bg: "surface" },
    }),
  },
};

const Avatar = {
  baseStyle: {
    container: {
      "&:not([data-loaded])": { "--avatar-background": "colors.accent-subtle" },
      color: "accent",
      fontFamily: "mono",
      fontWeight: 500,
      boxShadow: "inset 0 0 0 1px var(--chakra-colors-border)",
      "--avatar-border-color": "colors.bg",
      _dark: { "--avatar-border-color": "colors.bg" },
      img: { borderRadius: "full" },
    },
    excessLabel: { "--avatar-bg": "colors.surface-raised", fontFamily: "mono", color: "text-muted" },
  },
  sizes: {
    xs: { container: { w: "24px", h: "24px", fontSize: "10px" } },
    sm: { container: { w: "28px", h: "28px", fontSize: "11px" }, excessLabel: { w: "28px", h: "28px" } },
    md: { container: { w: "40px", h: "40px", fontSize: "14px" }, excessLabel: { w: "40px", h: "40px" } },
    lg: { container: { w: "56px", h: "56px", fontSize: "18px" } },
    xl: { container: { w: "88px", h: "88px", fontSize: "28px" } },
  },
};

const Tabs = {
  variants: {
    line: {
      tablist: { borderBottom: "1px solid", borderColor: "border" },
      tab: {
        color: "text-muted",
        fontSize: "14px",
        fontWeight: 600,
        h: "44px",
        px: 4,
        borderBottom: "2px solid",
        borderColor: "transparent",
        mb: "-1px",
        transition: `color 120ms ${ease}`,
        _hover: { color: "text-primary" },
        _selected: { color: "text-primary", borderColor: "accent", "--tabs-color": "colors.text-primary" },
        _disabled: { opacity: 1, cursor: "default", color: "text-muted", _hover: { color: "text-muted" } },
        _active: { bg: "transparent" },
      },
      tabpanel: { p: 0 },
    },
  },
};

const components = {
  Button,
  Input,
  Textarea,
  Select: { variants: { outline: { field: fieldStyle } } },
  Card,
  Menu,
  Modal,
  Drawer: { baseStyle: { overlay: { bg: "overlay" }, dialog: { bg: "surface", _dark: { bg: "surface" } } } },
  Popover: { baseStyle: { content: { ...floating, "--popper-bg": "colors.surface-raised", borderRadius: "md" } } },
  Alert,
  Avatar,
  Tabs,
  Divider: { baseStyle: { borderColor: "border", opacity: 1 } },
  Tooltip: {
    baseStyle: {
      "--tooltip-bg": "colors.text-primary",
      "--tooltip-fg": "colors.bg",
      _dark: { "--tooltip-bg": "colors.text-primary", "--tooltip-fg": "colors.bg" },
      borderRadius: "sm",
      fontSize: "12px",
      fontWeight: 500,
      px: 2,
      py: 1,
      boxShadow: "none",
    },
  },
  Skeleton: {
    baseStyle: {
      "--skeleton-start-color": "colors.surface-raised",
      "--skeleton-end-color": "colors.border",
      _dark: {
        "--skeleton-start-color": "colors.surface-raised",
        "--skeleton-end-color": "colors.border",
      },
      opacity: 1,
      borderRadius: "sm",
    },
  },
  Heading: {
    baseStyle: { fontWeight: 600, color: "text-primary", letterSpacing: 0 },
    variants: {
      display: { fontFamily: "display", fontWeight: 400, letterSpacing: "-0.01em" },
    },
  },
  Link: {
    baseStyle: {
      color: "accent",
      transition: `color 120ms ${ease}`,
      _hover: { color: "accent-hover", textDecoration: "underline" },
    },
  },
  Form: { baseStyle: { requiredIndicator: { color: "danger" }, helperText: { color: "text-muted", fontSize: "13px" } } },
  FormLabel: { baseStyle: { fontSize: "13px", fontWeight: 500, mb: 1.5, color: "text-secondary" } },
  FormError: { baseStyle: { text: { color: "danger", fontSize: "13px", mt: 1.5 }, icon: { color: "danger" } } },
  CloseButton: { baseStyle: { borderRadius: "sm" } },
  Checkbox: { baseStyle: { control: { borderRadius: "sm", borderColor: "border-strong" }, label: { fontSize: "14px" } } },
  Spinner: { baseStyle: { color: "accent" } },
};

const theme = extendTheme({
  config: { initialColorMode: "light", useSystemColorMode: false },
  fonts: {
    heading: "'Schibsted Grotesk', ui-sans-serif, system-ui, sans-serif",
    body: "'Schibsted Grotesk', ui-sans-serif, system-ui, sans-serif",
    display: "'Instrument Serif', ui-serif, Georgia, serif",
    mono: "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
  },
  fontSizes: {
    "2xs": "0.6875rem", // 11 mono labels
    xs: "0.75rem", // 12 meta
    sm: "0.8125rem", // 13 ui small
    md: "0.9375rem", // 15 body
    lg: "1.0625rem", // 17 emphasized
    xl: "1.25rem", // 20 title
    "2xl": "1.75rem", // 28 display
    "3xl": "2.5rem", // 40 display-xl
    "4xl": "3.5rem", // 56 hero
    "5xl": "3.5rem",
    "6xl": "3.5rem",
  },
  radii: {
    none: "0",
    sm: "4px",
    base: "4px",
    md: "6px",
    lg: "8px",
    xl: "8px",
    "2xl": "8px",
    "3xl": "8px",
    full: "9999px",
  },
  shadows: {
    float: "0 1px 2px rgba(26, 25, 21, 0.06), 0 8px 24px rgba(26, 25, 21, 0.10)",
    outline: focusRing,
  },
  colors: { primary: primaryLight },
  semanticTokens: {
    colors: {
      ...tokens,
      "chakra-body-bg": pair(palette.bg),
      "chakra-body-text": pair(palette["text-primary"]),
      "chakra-border-color": pair(palette.border),
      "chakra-placeholder-color": pair(palette["text-muted"]),
      "chakra-subtle-bg": pair(palette["surface-raised"]),
      ...primaryTokens,
      ...flatPairs("bgColor", legacyBg),
      ...flatPairs("textColor", legacyText),
    },
  },
  textStyles: {
    meta: { fontFamily: "mono", fontSize: "12px", lineHeight: "16px", color: "text-muted" },
    label: {
      fontFamily: "mono",
      fontSize: "11px",
      lineHeight: "16px",
      fontWeight: 500,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "text-muted",
    },
    ui: { fontSize: "13px", lineHeight: "18px" },
    body: { fontSize: "15px", lineHeight: "22px" },
    title: { fontSize: "20px", lineHeight: "26px", fontWeight: 600 },
    display: { fontFamily: "display", fontSize: "28px", lineHeight: "32px", fontWeight: 400 },
    "display-xl": { fontFamily: "display", fontSize: "40px", lineHeight: "44px", fontWeight: 400, letterSpacing: "-0.01em" },
    hero: { fontFamily: "display", fontSize: "56px", lineHeight: "56px", fontWeight: 400, letterSpacing: "-0.01em" },
  },
  styles: {
    global: {
      "html, body": {
        bg: "bg",
        color: "text-primary",
        fontSize: "15px",
        lineHeight: "22px",
        WebkitFontSmoothing: "antialiased",
        textRendering: "optimizeLegibility",
      },
      "::selection": { bg: "accent-subtle", color: "text-primary" },
      "@media (prefers-reduced-motion: reduce)": {
        "*, *::before, *::after": {
          animationDuration: "0.01ms !important",
          animationIterationCount: "1 !important",
          transitionDuration: "0.01ms !important",
          scrollBehavior: "auto !important",
        },
      },
    },
  },
  components,
});

export default theme;
