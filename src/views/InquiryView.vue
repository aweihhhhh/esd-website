<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: t('common.breadcrumbHome'), to: '/' }, { text: t('inquiry.title') }]" />

    <h1 class="mt-4 text-2xl md:text-3xl font-bold text-brand-500">{{ t('inquiry.title') }}</h1>
    <p class="text-sm text-gray-500 mt-1">
      {{ t('inquiry.sub', { hours: 12 }) }}
    </p>

    <div class="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
      <section>
        <form @submit.prevent="submitForm" class="card p-6 space-y-5">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.company') }} <span class="text-red-500">*</span></label>
              <input v-model="form.companyName" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.contact') }} <span class="text-red-500">*</span></label>
              <input v-model="form.contactName" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.email') }} <span class="text-red-500">*</span></label>
              <input v-model="form.contactEmail" type="email" required
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.whatsapp') }}</label>
              <input v-model="form.contactPhone" type="text"
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.qty') }}</label>
              <input v-model="form.totalQty" type="text" placeholder="e.g. 10,000 / month"
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.industry') }}</label>
              <select v-model="form.industry" class="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option value="">--</option>
                <option v-for="(ind, i) in industries" :key="i" :value="ind">{{ ind }}</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.models') }}</label>
            <textarea v-model="form.models" rows="3" :placeholder="t('inquiry.modelsHint')"
                      class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"></textarea>
            <p class="text-xs text-gray-400 mt-1">{{ t('inquiry.modelsHelp') }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.remarks') }}</label>
            <textarea v-model="form.notes" rows="3" :placeholder="t('inquiry.remarksHint')"
                      class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">{{ t('inquiry.attach') }}</label>
            <input type="file" @change="onFile" accept=".pdf,.xls,.xlsx,.csv"
                   class="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-brand-50 file:text-brand-500 hover:file:bg-brand-100" />
            <p class="text-xs text-gray-400 mt-1">{{ t('inquiry.attachHelp') }}</p>
          </div>

          <button type="submit" :disabled="submitting" class="btn-accent w-full !py-3">
            {{ submitting ? t('inquiry.submitting') : '📩 ' + t('inquiry.submit') }}
          </button>
        </form>
      </section>

      <aside class="space-y-4">
        <div class="card p-5">
          <h3 class="font-semibold text-brand-500 mb-3">{{ t('inquiry.whyTitle') }}</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li v-for="(w, i) in why" :key="i">{{ w }}</li>
          </ul>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold text-brand-500 mb-3">{{ t('inquiry.directTitle') }}</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>📧 sales@esd-diode.com</li>
            <li>📱 +86 138 0000 0000</li>
            <li>💬 <a href="https://wa.me/8613800000000" target="_blank" class="text-accent hover:underline">WhatsApp</a></li>
            <li>🕘 {{ t('header.hours') }}</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import Breadcrumb from '@/components/Breadcrumb.vue'

const { t, tm } = useI18n()
const route = useRoute()

const form = reactive({
  companyName: '', contactName: '', contactEmail: '', contactPhone: '',
  totalQty: '', industry: '', models: '', notes: ''
})
const submitting = ref(false)

const why = computed(() => tm('inquiry.why'))
const industries = computed(() => tm('inquiry.industries'))

onMounted(() => {
  if (route.query.model)  form.models = String(route.query.model)
  if (route.query.models) form.models = String(route.query.models)
})

const onFile = (e) => {
  const f = e.target.files[0]
  if (f && f.size > 10 * 1024 * 1024) {
    ElMessage.error('File too large (max 10MB)')
    e.target.value = ''
  }
}

const submitForm = async () => {
  submitting.value = true
  const record = {
    ...form,
    id: 'INQ-' + Date.now(),
    submittedAt: new Date().toISOString()
  }
  try {
    // 1. 存到 localStorage
    const list = JSON.parse(localStorage.getItem('inquiries') || '[]')
    list.unshift(record)
    localStorage.setItem('inquiries', JSON.stringify(list))

    // 2. 如果后端可用, 也发到后端
    try {
      const apiModule = await import('@/api/client.js')
      await apiModule.api.inquiries.submit({ ...form, items: [] })
    } catch (e) {
      console.log('Backend unavailable, inquiry saved locally only')
    }

    await new Promise(r => setTimeout(r, 400))
    submitting.value = false

    await ElMessageBox.alert(
      t('inquiry.submitted', { name: form.contactName, email: form.contactEmail, ref: record.id }),
      '✓ ' + t('auth.success'),
      { confirmButtonText: t('common.confirm'), type: 'success' }
    )
    Object.assign(form, { companyName: '', contactName: '', contactEmail: '', contactPhone: '', totalQty: '', industry: '', models: '', notes: '' })
  } catch (e) {
    submitting.value = false
  }
}
</script>
