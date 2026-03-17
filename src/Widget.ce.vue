<script setup>
import Vapi from "@vapi-ai/web";
import { ref } from "vue";

const props = defineProps({
  publicKey: { type: String, required: true },
  assistantId: { type: String, required: true },
});

const vapiInstance = ref(null);
const callStatus = ref("idle");

const handleToggle = async () => {
  if (callStatus.value === "active") {
    vapiInstance.value?.stop();
    return;
  }

  callStatus.value = "loading";

  try {
    const vapi = new Vapi(props.publicKey);
    vapiInstance.value = vapi;

    vapi.on("call-start", () => (callStatus.value = "active"));
    vapi.on("call-end", () => {
      callStatus.value = "idle";
      vapiInstance.value = null;
    });

    vapi.on("error", (err) => {
      console.error("Vapi Error:", err);
      callStatus.value = "idle";
    });

    await navigator.mediaDevices.getUserMedia({ audio: true });
    await vapi.start(props.assistantId);
  } catch (err) {
    console.error("Initialization Error:", err);
    callStatus.value = "idle";
  }
};
</script>

<template>
  <div class="vapi-widget-wrapper">
    <button @click="handleToggle" :class="['main-btn', callStatus]" :disabled="callStatus === 'loading'">
      <span v-if="callStatus === 'idle'" class="icon">🎤</span>
      <span v-else-if="callStatus === 'loading'" class="spinner"></span>
      <span v-else class="icon">⏹</span>

      <span class="label">
        {{ callStatus === "active" ? "End Call" : "Talk to AI" }}
      </span>
    </button>
  </div>
</template>

<style>
.vapi-widget-wrapper {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.main-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 24px;
  border-radius: 999px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  color: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.idle {
  background: #1a1a1a;
}
.idle:hover {
  transform: translateY(-2px);
  background: #333;
}

.active {
  background: #ef4444;
  animation: pulse 2s infinite;
}

.loading {
  background: #666;
  cursor: not-allowed;
  opacity: 0.8;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff33;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  70% {
    box-shadow: 0 0 0 15px rgba(239, 68, 68, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
  }
}
</style>
