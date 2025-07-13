<script lang="ts">
  interface Props {
    size?: number | string;
    strokeWidth?: number;
    class?: string;
    stroke?: string;
  }

  let {
    size = 8,
    strokeWidth = 0.25,
    class: className = '',
    stroke = 'currentColor'
  }: Props = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 48 48"
  width={size}
  height={size}
  {stroke}
  stroke-width={strokeWidth}
  class="{className} fill-current"
>
  <g fill="none">
    <path
      stroke="currentColor"
      stroke-linejoin="round"
      stroke-width="4"
      d="m6 42l8.674-24.736L31 34.038z"
    />
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="4"
      d="m23 19l5-5q4-4 1-7m0 18l5-5q5-5 10 0"
    />
    <path
      fill="currentColor"
      d="M20 7a2 2 0 1 0 0-4a2 2 0 0 0 0 4m22-1a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 23a2 2 0 1 0 0-4a2 2 0 0 0 0 4m-3 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4"
    />
  </g>
</svg>
