// 配置API参数（必须修改）
const API_KEY = '0154612d-b2a1-4fa6-a644-a58a97a79496'; // 替换为火山引擎获取的真实密钥
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 公共cors-anywhere代理URL
const proxyUrl = 'https://0038-2408-8207-6c83-1690-a934-629d-a7c3-10b5.ngrok-free.app/';

// 正确拼接 URL
const fullUrl = proxyUrl + API_URL.replace(/^https?:\/\//, '');

// DOM元素
const btn = document.getElementById('generateBtn');
const questionText = document.getElementById('questionText');
const loader = document.querySelector('.loader');

// 生成题目函数
async function generateQuestion() {
    try {
        // 显示加载状态
        btn.disabled = true;
        questionText.textContent = '';
        loader.style.display = 'block';

        // 调用API
        const response = await fetch(fullUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-r1-250120",
                messages: [{
                    role: "user",
                    content: "生成一道小学三年级数学题"
                }],
            })
        });

        // 处理响应
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "";

        // 使用正则表达式提取题目部分
        const questionMatch = content.match(/\*\*题目：\*\*\s*([\s\S]*?)\n\n/);
        const question = questionMatch ? questionMatch[1].trim() : "未找到题目";

        // 显示题目
        questionText.textContent = question;

        // 如果题目生成成功，启用按钮
        if (questionText.textContent.trim() !== "") {
            btn.disabled = false;
        }

    } catch (error) {
        console.error('发生错误:', error);
        questionText.textContent = '题目生成失败，请点击按钮重试';
    } finally {
        loader.style.display = 'none';
    }
}

// 绑定事件
btn.addEventListener('click', generateQuestion);

// 页面加载时生成第一题
window.addEventListener('load', generateQuestion);

// 监听文本框内容变化，控制按钮状态
questionText.addEventListener('input', () => {
    btn.disabled = questionText.textContent.trim() === "";
});