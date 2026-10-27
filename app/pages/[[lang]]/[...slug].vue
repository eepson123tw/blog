<script setup lang="ts">
// 覆寫 Docus 的文章頁：加上建立時間／閱讀時間、系列導覽、GitTalk 留言
import { kebabCase } from 'scule'
import type { ContentNavigationItem, Collections } from '@nuxt/content'
import { findPageHeadline } from '@nuxt/content/utils'

definePageMeta({
  layout: 'docs',
})

const route = useRoute()
const { locale, isEnabled, t } = useDocusI18n()
const { isOpen } = useAssistant()
const appConfig = useAppConfig()
const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
const collectionName = computed(() => isEnabled.value ? `docs_${locale.value.toLowerCase().replace(/-/g, '_')}` : 'docs')

type DocsPage = Collections['docs_zh_tw'] & { links?: Record<string, unknown>[] }

const [{ data: page }, { data: surround }] = await Promise.all([
  useAsyncData(kebabCase(route.path), () => queryCollection(collectionName.value as keyof Collections).path(route.path).first() as Promise<DocsPage>),
  useAsyncData(`${kebabCase(route.path)}-surround`, () => {
    return queryCollectionItemSurroundings(collectionName.value as keyof Collections, route.path, {
      fields: ['description'],
    })
  }),
])

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// date／read／gitTalk／badges 不在 Docus schema 裡，會放在 meta
const meta = computed(() => (page.value?.meta || {}) as { date?: string, read?: string, gitTalk?: boolean, badges?: { value: string }[] })

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

const headline = ref(findPageHeadline(navigation?.value, page.value?.path))
const breadcrumbs = computed(() => findPageBreadcrumbs(navigation?.value, page.value?.path || ''))

useSeo({
  title,
  description,
  type: 'article',
  modifiedAt: (page.value as unknown as Record<string, unknown>).modifiedAt as string | undefined,
  breadcrumbs,
})
watch(() => navigation?.value, () => {
  headline.value = findPageHeadline(navigation?.value, page.value?.path) || headline.value
})

defineOgImage('Docs', {
  headline: headline.value,
  title: formatOgTitle(title),
  description: formatOgDescription(title, description),
})

const github = computed(() => appConfig.github ? appConfig.github : null)

const editLink = computed(() => {
  if (!github.value) {
    return
  }

  return [
    github.value.url,
    'edit',
    github.value.branch,
    github.value.rootDir,
    'content',
    `${page.value?.stem}.${page.value?.extension}`,
  ].filter(Boolean).join('/')
})
</script>

<template>
  <UPage
    v-if="page"
    :ui="isOpen ? { center: 'lg:col-span-10' } : undefined"
  >
    <UPageHeader
      :title="page.title"
      :description="page.description"
      :headline="headline"
      :ui="{
        wrapper: 'flex-row items-center flex-wrap justify-between',
      }"
    >
      <template #links>
        <UButton
          v-for="(link, index) in (page as DocsPage).links"
          :key="index"
          size="sm"
          v-bind="link"
        />

        <LazyDocsPageHeaderLinks hydrate-on-idle />
      </template>
    </UPageHeader>

    <UPageBody>
      <div
        v-if="meta.date || meta.badges?.length"
        class="mb-6 flex flex-col gap-3"
      >
        <Infos
          v-if="meta.date"
          :date="meta.date"
          :read="meta.read"
        />
        <div
          v-if="meta.badges?.length"
          class="flex flex-wrap gap-2"
        >
          <UBadge
            v-for="badge in meta.badges"
            :key="badge.value"
            :label="badge.value"
            variant="subtle"
            icon="i-lucide-info"
          />
        </div>
      </div>

      <SeriesNav
        :path="page.path"
        class="mb-8"
      />

      <ContentRenderer
        v-if="page"
        :value="page"
      />

      <ClientOnly v-if="meta.gitTalk">
        <GitTalk class="mt-10" />
      </ClientOnly>

      <USeparator v-if="github">
        <div
          class="flex items-center gap-2 text-sm text-muted"
        >
          <UButton
            variant="link"
            color="neutral"
            :to="editLink"
            target="_blank"
            icon="i-lucide-pen"
            :ui="{ leadingIcon: 'size-4' }"
          >
            {{ t('docs.edit') }}
          </UButton>
          <template v-if="github?.url">
            <span>{{ t('common.or') }}</span>
            <UButton
              variant="link"
              color="neutral"
              :to="`${github.url}/issues/new/choose`"
              target="_blank"
              icon="i-lucide-alert-circle"
              :ui="{ leadingIcon: 'size-4' }"
            >
              {{ t('docs.report') }}
            </UButton>
          </template>
        </div>
      </USeparator>
      <LazyUContentSurround
        :surround="surround"
        hydrate-on-visible
      />
    </UPageBody>

    <template
      v-if="!isOpen"
      #right
    >
      <DocsAsideRight
        :page="page"
      />
    </template>
  </UPage>
</template>
