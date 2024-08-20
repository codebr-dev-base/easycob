<template>
  <q-dialog v-model="showForm">
    <q-card style="max-width: 90vw">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Criar Campanha</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator inset />
      <q-card-section>
        <q-form
          @submit="onSubmit"
          class="q-gutter-md"
          ref="campaignForm"
          autocorrect="on"
          autocapitalize="on"
          autocomplete="on"
          spellcheck="true"
        >
          <div class="row">
            <div class="col-12 q-px-xs">
              <q-input
                filled
                name="name"
                v-model="templateModel.name"
                label="Nome da campanha"
                :rules="[isEmpty]"
                dense
              />
            </div>
          </div>

          <div class="row">
            <div class="col-12 q-px-xs">
              <q-card dark bordered class="bg-grey-9 my-card">
                <q-card-section class="row items-center q-py-none">
                  <div class="text-subtitle1">Tags</div>
                </q-card-section>

                <q-separator dark inset />

                <q-card-section>
                  <q-chip dense icon="tag">
                    ${cliente}
                    <q-tooltip> nome do cliente </q-tooltip>
                  </q-chip>
                  <q-chip dense icon="tag">
                    ${filial}
                    <q-tooltip> nome da filial </q-tooltip>
                  </q-chip>
                  <q-chip dense icon="tag">
                    ${whatsapp}
                    <q-tooltip> whatsapp da campanha </q-tooltip>
                  </q-chip>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12 q-px-xs">
              <q-input
                v-if="type == 'SMS'"
                filled
                name="template"
                v-model="templateModel.template"
                label="Mensagem da campanha"
                type="textarea"
              />
              <q-editor
                v-else
                ref="editor"
                v-model="templateModel.template"
                min-height="10rem"
                :definitions="{
                  image: {
                    tip: 'Imagem',
                    icon: 'image',
                    handler: uploadIt,
                  },
                }"
                :dense="$q.screen.lt.md"
                :toolbar="[
                  [
                    {
                      label: $q.lang.editor.align,
                      icon: $q.iconSet.editor.align,
                      fixedLabel: true,
                      list: 'only-icons',
                      options: ['left', 'center', 'right', 'justify'],
                    },
                  ],
                  [
                    'bold',
                    'italic',
                    'strike',
                    'underline',
                    'subscript',
                    'superscript',
                  ],
                  ['token', 'hr', 'link', 'image', 'custom_btn'],
                  ['print', 'fullscreen'],
                  [
                    {
                      label: $q.lang.editor.formatting,
                      icon: $q.iconSet.editor.formatting,
                      list: 'no-icons',
                      options: [
                        'p',
                        'h1',
                        'h2',
                        'h3',
                        'h4',
                        'h5',
                        'h6',
                        'code',
                      ],
                    },
                    {
                      label: $q.lang.editor.fontSize,
                      icon: $q.iconSet.editor.fontSize,
                      fixedLabel: true,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'size-1',
                        'size-2',
                        'size-3',
                        'size-4',
                        'size-5',
                        'size-6',
                        'size-7',
                      ],
                    },
                    {
                      label: $q.lang.editor.defaultFont,
                      icon: $q.iconSet.editor.font,
                      fixedIcon: true,
                      list: 'no-icons',
                      options: [
                        'default_font',
                        'arial',
                        'arial_black',
                        'comic_sans',
                        'courier_new',
                        'impact',
                        'lucida_grande',
                        'times_new_roman',
                        'verdana',
                      ],
                    },
                    'removeFormat',
                  ],
                  ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

                  ['undo', 'redo'],
                  ['viewsource'],
                ]"
                :fonts="{
                  arial: 'Arial',
                  arial_black: 'Arial Black',
                  comic_sans: 'Comic Sans MS',
                  courier_new: 'Courier New',
                  impact: 'Impact',
                  lucida_grande: 'Lucida Grande',
                  times_new_roman: 'Times New Roman',
                  verdana: 'Verdana',
                }"
              />
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/png, image/jpeg"
                class="hidden"
                ref="inputFile"
                @change="selectFiles"
              />
            </div>
          </div>

          <div class="row justify-end q-my-sm">
            <q-btn
              label="Salvar"
              type="submit"
              color="primary"
              class="q-ml-sm"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script lang="ts" setup>
import { QEditor, QForm } from "quasar";
import { isEmpty } from "@/validation/entity";
const emit = defineEmits(["update:showForm", "create:template"]);
const campaignForm = ref<QForm | null>(null);
const inputFile = ref<HTMLInputElement>();
const editor = ref<QEditor>();

const props = defineProps({
  showForm: Boolean,
  type: {
    type: String,
    required: true,
  },
});

const campaign = {
  name: "",
  template: "",
};

const templateModel = ref({ ...campaign });

const showForm = computed({
  get() {
    return props.showForm;
  },
  set(value) {
    emit("update:showForm", value);
  },
});

watch(
  () => props.showForm,
  (newValue, oldValue) => {
    templateModel.value = { ...campaign };
  },
  { deep: true }
);

const description = ref("");

const onSubmit = (event: any) => {
  campaignForm.value?.validate().then((success) => {
    if (success) {
      emit("create:template", templateModel.value);
    }
  });
};

const uploadIt = () => {
  inputFile.value?.click();
};

const toBase64 = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

const selectFiles = async (e: Event) => {
  const target = e.target as HTMLInputElement;

  if (target && target.files) {
    const files = target.files;
    for (const file of files) {
      editor.value?.caret.restore();
      editor.value?.runCmd(
        "insertHTML",
        `<img src="${await toBase64(file)}"/>`
      );
      editor.value?.focus();
      console.log(await toBase64(file));
    }
  }
};
</script>

<style></style>
