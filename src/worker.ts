import handler, { createScheduledHandler, PluginBridge } from '@emdash-cms/cloudflare/worker'

/*
  Einstieg des Workers: Astro und EmDash beantworten die Anfragen, der
  Cron-Trigger aus wrangler.jsonc stößt geplante Veröffentlichungen und die
  Wartung von EmDash an.
*/
export { PluginBridge }

export default {
  ...handler,
  scheduled: createScheduledHandler(),
} satisfies ExportedHandler
