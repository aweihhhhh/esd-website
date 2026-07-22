<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.breadcrumbHome'), to: '/' }, { text: t('nav.contact') }]" />

    <h1 class="mt-4 text-2xl md:text-3xl font-bold text-brand-500">{{ t('contact.title') }}</h1>
    <p class="text-sm text-gray-500 mt-1">{{ t('contact.sub') }}</p>

    <div class="mt-6 grid gap-6 md:grid-cols-3">
      <div v-for="c in contacts" :key="c.title" class="card p-6 text-center">
        <div class="text-3xl">{{ c.icon }}</div>
        <h3 class="mt-2 font-semibold text-brand-500">{{ c.title }}</h3>
        <p class="text-sm text-gray-500 mt-1 whitespace-pre-line">{{ c.value }}</p>
        <a v-if="c.link" :href="c.link" target="_blank" class="mt-3 inline-block text-sm text-accent hover:underline">{{ c.cta }} →</a>
      </div>
    </div>

    <section class="mt-10 card overflow-hidden">
      <div class="aspect-[16/6] bg-gradient-to-br from-brand-100 to-gray-200 grid place-items-center text-brand-500">
        <div class="text-center">
          <div class="text-4xl">📍</div>
          <div class="mt-2 font-semibold">{{ t('footer.address') }}</div>
          <div class="text-xs text-gray-500">Building 7, Guangming District, Shenzhen 518107</div>
        </div>
      </div>
    </section>

    <section class="mt-10 card p-6">
      <h2 class="text-xl font-bold text-brand-500">{{ t('contact.quickMsg') }}</h2>
      <p class="text-sm text-gray-500 mt-1">{{ t('contact.quickMsgSub') }}</p>
      <form @submit.prevent="send" class="mt-4 grid gap-4 md:grid-cols-2">
        <input v-model="form.name"    required :placeholder="t('contact.yourName')" class="px-3 py-2 border border-gray-300 rounded text-sm" />
        <input v-model="form.email"   required type="email" :placeholder="t('auth.email')" class="px-3 py-2 border border-gray-300 rounded text-sm" />
        <input v-model="form.subject" required :placeholder="t('contact.subject')" class="md:col-span-2 px-3 py-2 border border-gray-300 rounded text-sm" />
        <textarea v-model="form.message" required rows="4" :placeholder="t('contact.message')"
                  class="md:col-span-2 px-3 py-2 border border-gray-300 rounded text-sm"></textarea>
        <button type="submit" class="btn-primary md:col-span-2 !py-2.5">{{ t('contact.send') }}</button>
      </form>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { ElMessage } from 'element-plus'

const { t } = useI18n()
const form = reactive({ name: '', email: '', subject: '', message: '' })

const contacts = computed(() => [
  { icon: '📧', title: 'Email',    value: 'sales@esd-diode.com\nsupport@esd-diode.com', link: 'mailto:sales@esd-diode.com', cta: t('contact.send') || 'Send Email' },
  { icon: '📱', title: 'Phone / WhatsApp', value: '+86 138 0000 0000\n' + t('header.hours'), link: 'https://wa.me/8613800000000', cta: 'WhatsApp Chat' },
  { icon: '🏢', title: 'Factory Address', value: 'Building 7, Hi-Tech Industrial Park\nGuangming District, Shenzhen 518107, China', link: null }
])

const send = () => {
  const record = { ...form, sentAt: new Date().toISOString() }
  const list = JSON.parse(localStorage.getItem('messages') || '[]')
  list.unshift(record)
  localStorage.setItem('messages', JSON.stringify(list))
  ElMessage.success(t('contact.send') + ' ✓')
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
}
</script>
