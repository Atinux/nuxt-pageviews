import { useNuxtApp, useRoute, useState } from "#app"
import { ref } from "#imports"
import { Ref, watch } from "vue"

export const usePageViews = async (path?: string | undefined) => {
  if (!path) {
    path = useRoute().path
  }
  if (path !== undefined) {
    const allPageViews = await useState<{ [key: string]: string }>("pageviews", () => ( {} ))
    const views: Ref<string> = ref("0")
    if (process.client) {
      const unwatch = watch(allPageViews.value, (allPageViews: { [key: string]: string }) => {
        views.value = allPageViews[`${path}`]
      })

      useNuxtApp().hook("page:start", () => {
        unwatch()
      })
    }

    views.value = allPageViews.value[`${path}`] || "0"
    return views
  }
}
