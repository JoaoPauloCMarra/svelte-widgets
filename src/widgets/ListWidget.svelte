<script lang="typescript">
  import Form from '../shared/Form.svelte';
  import List from '../shared/List.svelte';

  type Route = 'list' | 'form';
  let route: Route = 'list';

  // const changeRoute = (nextRoute: Route) => {
  //   route = nextRoute;
  // };

  const routes = {
    list: List,
    form: Form,
  };
  const RouteComponent = routes[route];
</script>

<div class="list-widget center">
  <div class="route"><RouteComponent /></div>
</div>
