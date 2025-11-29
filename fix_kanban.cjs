const fs = require('fs');
const path = 'src/components/KanbanBoard.tsx';

try {
    let content = fs.readFileSync(path, 'utf8');

    // 1. Eksik CONTRACT_ADDRESS'i ekle
    if (!content.includes('const CONTRACT_ADDRESS')) {
        content = content.replace(
            'const TASK_JOURNAL_ABI',
            'const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // BURAYA GERÇEK KONTRAT ADRESİNİ YAZ\nconst TASK_JOURNAL_ABI'
        );
    }

    // 2. Syntax Hatasını Düzelt (ABI bitişi ve defaultCols başlangıcı)
    // Hatalı kısım: name: "logTasks",\n    },\n    {\n        id: "bounty",
    // Olması gereken: name: "logTasks",\n    }\n];\nconst defaultCols = [\n    {\n        id: "bounty",

    // Regex ile hatalı birleşimi bulup araya eksik kodları koyuyoruz
    const brokenPattern = /name:\s*"logTasks",\s*\}\s*,\s*\{\s*id:\s*"bounty"/;
    const fixedPattern = 'name: "logTasks",\n    }\n];\n\nconst defaultCols = [\n    {\n        id: "bounty"';

    if (brokenPattern.test(content)) {
        content = content.replace(brokenPattern, fixedPattern);
        console.log('✅ Syntax hatası düzeltildi (defaultCols tanımlandı).');
    } else if (!content.includes('const defaultCols =')) {
        console.log('⚠️ Otomatik düzeltme eşleşmedi, dosya yapısı beklenenden farklı olabilir.');
    }

    // 3. moveTask kullanımını güncelle (Index yerine ID göndermeli)
    // onDragOver içindeki moveTask(activeIndex, overIndex) -> moveTask(activeId, overId)
    content = content.replace(/moveTask\(activeIndex, overIndex\);/g, 'moveTask(activeId as string, overId as string);');

    fs.writeFileSync(path, content, 'utf8');
    console.log('🎉 KanbanBoard.tsx başarıyla onarıldı!');

} catch (err) {
    console.error('Hata oluştu:', err);
}
