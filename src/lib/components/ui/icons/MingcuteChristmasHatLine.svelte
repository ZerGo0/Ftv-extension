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
  viewBox="0 0 24 24"
  width={size}
  height={size}
  {stroke}
  stroke-width={strokeWidth}
  class="{className} fill-current"
>
  <g fill="none" fill-rule="evenodd">
    <path
      fill="currentColor"
      d="M12.23 3a7.23 7.23 0 0 1 7.21 6.676l.544 7.073A3 3 0 1 1 15 19l-9 .001a3 3 0 0 1-1-5.83v-2.94A7.23 7.23 0 0 1 12.23 3M18 18a1 1 0 1 0 0 2a1 1 0 0 0 0-2m-2.72-3H6a1 1 0 0 0-.117 1.993L6 17h9.764l.135-.141zM12.23 5a5.23 5.23 0 0 0-5.226 5.015L7 10.23V13h7.613l-.562-1.684a1 1 0 0 1 1.854-.74l.044.108l1.776 5.328l.195-.011l-.475-6.172A5.23 5.23 0 0 0 12.23 5"
    />
  </g>
</svg>
