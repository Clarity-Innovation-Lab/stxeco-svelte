<script context="module">
    export function load({ error, status }) {
        return {
            props: {
                title: `${status}: ${error.message}`
            }
        };
    }
  </script>
  
  <script>
    export let title;
  </script>
  
  <h1>{title}</h1>
  <p>An error occurred fetching data from an external source. Please
    bear with us while we fix this issue.</p>
    <p>Thank you for your patience.</p>
  