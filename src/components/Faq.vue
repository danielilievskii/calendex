<template>
    <div class="faq">
        <h1 class="faq-title">Frequently Asked Questions</h1>
        <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
            <button @click="toggle(index)" class="faq-question">
                {{ item.question }}
            </button>
            <div v-if="item.open" class="faq-answer">
                {{ item.answer }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Faq',
    data() {
        return {
            faqItems: [
                { question: 'What is ShadCN Vue?', answer: 'ShadCN Vue is a component library for Vue.js.', open: false },
                { question: 'How do I install ShadCN Vue?', answer: 'You can install it via npm or yarn.', open: false },
                // Add more FAQ items here
            ]
        };
    },
    methods: {
        toggle(index) {
            this.faqItems[index].open = !this.faqItems[index].open;
        }
    }
};
</script>

<style scoped>
.faq {
    padding: 20px;
}

.faq-title {
    font-size: 24px;
    margin-bottom: 20px;
}

.faq-item {
    margin-bottom: 10px;
}

.faq-question {
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
}

.faq-answer {
    margin-top: 5px;
    font-size: 16px;
}
</style>