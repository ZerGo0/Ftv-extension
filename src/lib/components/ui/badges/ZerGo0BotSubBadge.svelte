<script lang="ts">
  import "@/assets/badges.css";
  import type { ZerGo0Badge } from "@/lib/types";

  interface Props {
    badge: ZerGo0Badge;
    size?: number;
    textSize?: string;
  }

  let { badge, size, textSize = "md" }: Props = $props();

  const badgeSizeMap: { [key: string]: number } = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 28,
  };

  let badgeSize: number = $derived(size || badgeSizeMap[textSize] || 16);

  function getBadgeStyle(badge: ZerGo0Badge): string {
    let style = `width: ${badgeSize}px; height: ${badgeSize}px;`;

    // Apply background color or gradient
    if (badge.gradientColors && badge.gradientColors.length > 0) {
      const gradientString = badge.gradientColors.join(", ");
      style += ` background: linear-gradient(135deg, ${gradientString});`;

      // Set glow color based on first gradient color for glow animation
      if (badge.animationType === "glow") {
        style += ` --glow-color: ${badge.gradientColors[0]};`;
      }
    } else if (badge.backgroundColor) {
      style += ` background-color: ${badge.backgroundColor};`;
    } else if (badge.color) {
      style += ` background-color: #${badge.color};`;
    }

    // Apply border color
    if (badge.borderColor) {
      style += ` border: 1px solid ${badge.borderColor};`;
    }

    // Apply text color
    if (badge.textColor) {
      style += ` color: ${badge.textColor};`;
    }

    return style;
  }

  function getBadgeClass(badge: ZerGo0Badge): string {
    const classes = ["badge-item"];

    if (badge.special === "animated" && badge.animationType) {
      // Handle multiple animation types
      if (badge.animationType.includes("-")) {
        // Split combined animations and add each class
        const animations = badge.animationType.split("-");
        animations.forEach((anim) => classes.push(`badge-${anim}`));
      } else {
        classes.push(`badge-${badge.animationType}`);
      }
    }

    return classes.join(" ");
  }
</script>

<div class="ftv-badge-container">
  <div
    class={getBadgeClass(badge)}
    style={getBadgeStyle(badge)}
    title={badge.name}
  >
    <span class="badge-text"> Z </span>
    {#if badge.animationType === "glow-sparkle"}
      <span class="sparkle sparkle-1"></span>
      <span class="sparkle sparkle-2"></span>
      <span class="sparkle sparkle-3"></span>
      <span class="sparkle sparkle-4"></span>
      <span class="sparkle sparkle-5"></span>
      <span class="sparkle sparkle-6"></span>
      <span class="sparkle sparkle-7"></span>
      <span class="sparkle sparkle-8"></span>
      <span class="sparkle sparkle-9"></span>
      <span class="sparkle sparkle-10"></span>
      <span class="sparkle sparkle-11"></span>
      <span class="sparkle sparkle-12"></span>
      <span class="sparkle sparkle-13"></span>
      <span class="sparkle sparkle-14"></span>
      <span class="sparkle sparkle-15"></span>
      <span class="sparkle sparkle-16"></span>
    {/if}
  </div>
</div>
