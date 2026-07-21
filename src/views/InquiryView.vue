<template>
  <div class="container-x py-6">
    <Breadcrumb :items="[{ text: 'Home', to: '/' }, { text: 'Send Inquiry' }]" />

    <div class="mt-4 grid gap-8 md:grid-cols-[1fr_320px]">
      <!-- Form -->
      <section>
        <h1 class="text-2xl md:text-3xl font-bold text-brand-500">Request a Quote</h1>
        <p class="text-sm text-gray-500 mt-1">
          Tell us your requirements — our sales engineer replies within <b class="text-accent">12 hours</b>.
        </p>

        <form @submit.prevent="submitForm" class="mt-6 card p-6 space-y-5">
          <div class="grid gap-4 md:grid-cols-2">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Company Name <span class="text-red-500">*</span></label>
              <input v-model="form.company" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Contact Person <span class="text-red-500">*</span></label>
              <input v-model="form.contact" type="text" required
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email <span class="text-red-500">*</span></label>
              <input v-model="form.email" type="email" required
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">WhatsApp / Phone</label>
              <input v-model="form.whatsapp" type="text"
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Estimated Quantity (pcs)</label>
              <input v-model="form.qty" type="text" placeholder="e.g. 10,000 / month"
                     class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Industry / Application</label>
              <select v-model="form.industry" class="w-full px-3 py-2 border border-gray-300 rounded text-sm bg-white">
                <option value="">-- Please select --</option>
                <option>Consumer Electronics</option>
                <option>Mobile / Wearable</option>
                <option>Industrial Control</option>
                <option>Automotive</option>
                <option>Telecom / Networking</option>
                <option>Power Supply / Charger</option>
                <option>Trading / Distribution</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Target Models</label>
            <textarea v-model="form.models" rows="3" :placeholder="modelHint"
                      class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"></textarea>
            <p class="text-xs text-gray-400 mt-1">Multiple part numbers separated by commas. Or paste your BOM here.</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Remarks / Special Requirements</label>
            <textarea v-model="form.remarks" rows="3" placeholder="Lead time, packaging, certifications needed..."
                      class="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:border-brand-500 focus:ring-1 focus:ring-brand-500 outline-none"></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Attach BOM (PDF / Excel, optional)</label>
            <input type="file" @change="onFile" accept=".pdf,.xls,.xlsx,.csv"
                   class="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:bg-brand-50 file:text-brand-500 hover:file:bg-brand-100" />
            <p class="text-xs text-gray-400 mt-1">Max 10MB. (Frontend only stores file name; production should upload to OSS / S3.)</p>
          </div>

          <button type="submit" :disabled="submitting" class="btn-accent w-full !py-3">
            {{ submitting ? 'Submitting...' : '📩 Submit Inquiry' }}
          </button>
        </form>
      </section>

      <!-- Side info -->
      <aside class="space-y-4">
        <div class="card p-5">
          <h3 class="font-semibold text-brand-500 mb-3">Why Inquiry With Us</h3>
          <ul class="space-y-2 text-sm text-gray-600">
            <li>✓ 12-hour fast quote response</li>
            <li>✓ Free samples for bulk orders</li>
            <li>✓ Custom specifications supported</li>
            <li>✓ DDP / FOB / EXW trade terms</li>
            <li>✓ OEM &amp; ODM service</li>
          </ul>
        </div>
        <div class="card p-5">
          <h3 class="font-semibold text-brand-500 mb-3">Direct Contact</h3>
          <ul class="space-y-2 text-sm text-gray-700">
            <li>📧 sales@esd-diode.com</li>
            <li>📱 +86 138 0000 0000</li>
            <li>💬 <a href="https://wa.me/8613800000000" target="_blank" class="text-accent hover:underline">WhatsApp Chat</a></li>
            <li>🕘 Mon - Sat 9:00 - 18:00 (GMT+8)</li>
          </ul>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Breadcrumb from '@/components/Breadcrumb.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()

const form = ref({
  company: '', contact: '', email: '', whatsapp: '',
  qty: '', industry: '', models: '', remarks: ''
})
const submitting = ref(false)
const modelHint = 'e.g. SD05, GBLC05C, ESD8LL5.0C'

onMounted(() => {
  // 从 query 预填型号（来自产品卡片或批量选择）
  if (route.query.model)  form.value.models = String(route.query.model)
  if (route.query.models) form.value.models = String(route.query.models)
})

const onFile = (e) => {
  const f = e.target.files[0]
  if (f && f.size > 10 * 1024 * 1024) {
    ElMessage.error('File size exceeds 10MB')
    e.target.value = ''
  }
}

const submitForm = async () => {
  submitting.value = true
  // 模拟提交，存到 localStorage
  const record = {
    ...form.value,
    submittedAt: new Date().toISOString(),
    id: 'INQ-' + Date.now()
  }
  try {
    const list = JSON.parse(localStorage.getItem('inquiries') || '[]')
    list.unshift(record)
    localStorage.setItem('inquiries', JSON.stringify(list))

    await new Promise(r => setTimeout(r, 800))
    submitting.value = false

    await ElMessageBox.alert(
      `Thank you ${form.value.contact}! Your inquiry has been received.\nOur sales team will reply to ${form.value.email} within 12 hours.\nReference: ${record.id}`,
      'Inquiry Submitted ✓',
      { confirmButtonText: 'OK', type: 'success' }
    )
    // 重置表单
    form.value = { company: '', contact: '', email: '', whatsapp: '', qty: '', industry: '', models: '', remarks: '' }
  } catch (e) {
    submitting.value = false
  }
}
</script>
