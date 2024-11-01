<script lang="ts">
  interface Props {
    size?: number;
    strokeWidth?: number;
    class?: string;
    stroke?: string;
  }

  let {
    size = 8,
    strokeWidth = 2,
    class: className = "",
    stroke = "currentColor",
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  {stroke}
  stroke-width={strokeWidth}
  stroke-linecap="round"
  stroke-linejoin="round"
  class="{className} fill-current"
>
  <circle cx="12.1" cy="12.1" r={size / 2}></circle>
</svg>
