import { ApiEndpoint, ApiParameter } from '../types/api';

export function parseApiDocumentation(): ApiEndpoint[] {
    const endpoints: ApiEndpoint[] = [];

    // 1. Checklist CRUD APIs
    endpoints.push({
        id: 'checklist-list',
        name: 'List Checklists (Query/Filter)',
        method: 'GET',
        path: '/api/v2/check-lists',
        category: '1. Checklist CRUD',
        description: 'Retrieve a list of checklists with optional filtering',
        parameters: [
            { name: 'board_id', in: 'query', type: 'MongoId', required: false, description: 'Filter by board ID' },
            { name: 'board_list_id', in: 'query', type: 'MongoId', required: false, description: 'Filter by board list ID' },
            { name: 'card_id', in: 'query', type: 'MongoId', required: false, description: 'Filter by card ID' },
            { name: 'template_id', in: 'query', type: 'MongoId', required: false, description: 'Filter by template ID' },
            { name: 'group_id', in: 'query', type: 'MongoId', required: false, description: 'Filter by group ID' },
            { name: 'type', in: 'query', type: 'String', required: false, description: 'BOARD_LIST or CARD' },
            { name: 'status', in: 'query', type: 'String', required: false, description: 'ACTIVE, COMPLETED, or DEACTIVATED' },
        ],
    });

    endpoints.push({
        id: 'checklist-get',
        name: 'Get Single Checklist',
        method: 'GET',
        path: '/api/v2/check-lists/:id',
        category: '1. Checklist CRUD',
        description: 'Returns detailed checklist information',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
    });

    endpoints.push({
        id: 'checklist-create',
        name: 'Create Checklist',
        method: 'POST',
        path: '/api/v2/check-lists',
        category: '1. Checklist CRUD',
        description: 'Create a new checklist item',
        requestBody: {
            name: 'string (required)',
            board_id: 'MongoId (required)',
            board_list_id: 'MongoId (required)',
            type: 'BOARD_LIST | CARD (required)',
            description: 'string (optional)',
            position: 'number (optional)',
            card_id: 'MongoId (optional, required if type is CARD)',
            template_id: 'MongoId (optional)',
            group_id: 'MongoId (optional)',
            send_to: 'SELLER | BUYER | ALL | VENDOR (optional)',
            complete_action: 'string (optional)',
        },
    });

    endpoints.push({
        id: 'checklist-update',
        name: 'Update Checklist',
        method: 'PUT',
        path: '/api/v2/check-lists/:id',
        category: '1. Checklist CRUD',
        description: 'Update checklist metadata, email configurations, and external links',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            name: 'string (optional)',
            description: 'string (optional)',
            status: 'ACTIVE | COMPLETED | DEACTIVATED (optional)',
            send_to: 'SELLER | BUYER | ALL | VENDOR (optional)',
            complete_action: 'string (optional)',
            email_templates: 'Array<MongoId> (optional)',
            customEmail1: 'string (optional)',
            customEmail2: 'string (optional)',
            customEmail3: 'string (optional)',
            customEmail4: 'string (optional)',
            customEmailTemplateId1: 'MongoId (optional)',
            customEmailTemplateId2: 'MongoId (optional)',
            customEmailTemplateId3: 'MongoId (optional)',
            customEmailTemplateId4: 'MongoId (optional)',
            links: 'Array<{title: string, url: string}> (optional)',
        },
    });

    endpoints.push({
        id: 'checklist-delete',
        name: 'Delete Checklist',
        method: 'DELETE',
        path: '/api/v2/check-lists/:id',
        category: '1. Checklist CRUD',
        description: 'Delete a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
            { name: 'cascadeDeleteReports', in: 'query', type: 'Boolean', required: false, description: 'Also delete associated reports' },
        ],
    });

    // 2. Checklist Operation APIs
    endpoints.push({
        id: 'checklist-toggle',
        name: 'Toggle Completion',
        method: 'POST',
        path: '/api/v2/check-lists/:id/toggle',
        category: '2. Checklist Operations',
        description: 'Toggles completion status and triggers complete_action',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
    });

    endpoints.push({
        id: 'checklist-move',
        name: 'Move Checklist',
        method: 'POST',
        path: '/api/v2/check-lists/:id/move',
        category: '2. Checklist Operations',
        description: 'Moves a checklist to a specific position and optionally a different group',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            target_position: 'number (required)',
            target_group_id: 'MongoId (optional)',
            update_template_position: 'boolean (optional)',
        },
    });

    endpoints.push({
        id: 'checklist-move-position',
        name: 'Move to Position',
        method: 'POST',
        path: '/api/v2/check-lists/:id/move-to-position',
        category: '2. Checklist Operations',
        description: 'Move checklist to a specific position',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            position: 'number (required)',
            group_id: 'MongoId (optional)',
        },
    });

    endpoints.push({
        id: 'checklist-bulk-reorder',
        name: 'Bulk Reorder',
        method: 'POST',
        path: '/api/v2/check-lists/bulk-reorder',
        category: '2. Checklist Operations',
        description: 'Reorder multiple checklists at once',
        requestBody: {
            reorderData: [
                {
                    checklist_id: 'MongoId (required)',
                    position: 'number (required)',
                    group_id: 'MongoId (optional)',
                },
            ],
        },
    });

    endpoints.push({
        id: 'checklist-copy',
        name: 'Copy Checklist',
        method: 'POST',
        path: '/api/v2/check-lists/:id/copy',
        category: '2. Checklist Operations',
        description: 'Copy a checklist to another location',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            target_card_id: 'MongoId (optional)',
            target_group_id: 'MongoId (optional)',
            target_position: 'number (optional)',
        },
    });

    endpoints.push({
        id: 'checklist-unified-query',
        name: 'Unified Query',
        method: 'GET',
        path: '/api/v2/check-lists/unified/query',
        category: '2. Checklist Operations',
        description: 'Unified query endpoint with additional options',
        parameters: [
            { name: 'board_id', in: 'query', type: 'MongoId', required: false },
            { name: 'board_list_id', in: 'query', type: 'MongoId', required: false },
            { name: 'card_id', in: 'query', type: 'MongoId', required: false },
            { name: 'includeReports', in: 'query', type: 'Boolean', required: false },
            { name: 'includeGroups', in: 'query', type: 'Boolean', required: false },
            { name: 'sortBy', in: 'query', type: 'String', required: false },
            { name: 'sortOrder', in: 'query', type: 'String', required: false },
        ],
    });

    endpoints.push({
        id: 'checklist-unified-create',
        name: 'Unified Create',
        method: 'POST',
        path: '/api/v2/check-lists/unified/create',
        category: '2. Checklist Operations',
        description: 'Unified create endpoint with type validation',
        requestBody: {
            name: 'string (required)',
            board_id: 'MongoId (required)',
            board_list_id: 'MongoId (required)',
            type: 'BOARD_LIST | CARD (required)',
            card_id: 'MongoId (conditional)',
        },
    });

    endpoints.push({
        id: 'checklist-template-flat',
        name: 'Get Flat List for Template',
        method: 'GET',
        path: '/api/v2/check-lists/template/:templateId/flat',
        category: '2. Checklist Operations',
        description: 'Returns flattened checklist list for template',
        parameters: [
            { name: 'templateId', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
        ],
    });

    endpoints.push({
        id: 'checklist-active-for-card',
        name: 'Get Active Checklists for Card',
        method: 'GET',
        path: '/api/v2/check-lists/template/:templateId/active-checklists',
        category: '2. Checklist Operations',
        description: 'Get active checklists for a specific card',
        parameters: [
            { name: 'templateId', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
            { name: 'card', in: 'query', type: 'String', required: false, description: 'Card data as JSON string' },
        ],
    });

    endpoints.push({
        id: 'checklist-evaluate-matcher',
        name: 'Evaluate Card Matcher',
        method: 'POST',
        path: '/api/v2/check-lists/evaluate-card-matcher',
        category: '2. Checklist Operations',
        description: 'Evaluate if a card matches group criteria',
        requestBody: {
            groupId: 'MongoId (required)',
            card: 'Object (required)',
        },
    });

    // 3. Checklist Task APIs
    endpoints.push({
        id: 'task-add',
        name: 'Add Task to Checklist',
        method: 'POST',
        path: '/api/v2/check-lists/:id/tasks',
        category: '3. Checklist Tasks',
        description: 'Add a new task to a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            name: 'string (required)',
            description: 'string (optional)',
            dueDate: 'ISO Date (optional)',
            assignee: 'MongoId (optional)',
        },
    });

    endpoints.push({
        id: 'task-update',
        name: 'Update Task',
        method: 'PUT',
        path: '/api/v2/check-lists/:id/tasks/:taskId',
        category: '3. Checklist Tasks',
        description: 'Update a task in a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
            { name: 'taskId', in: 'path', type: 'MongoId', required: true, description: 'Task ID' },
        ],
        requestBody: {
            name: 'string (optional)',
            description: 'string (optional)',
            dueDate: 'ISO Date (optional)',
            assignee: 'MongoId (optional)',
            completed: 'boolean (optional)',
        },
    });

    endpoints.push({
        id: 'task-delete',
        name: 'Delete Task',
        method: 'DELETE',
        path: '/api/v2/check-lists/:id/tasks/:taskId',
        category: '3. Checklist Tasks',
        description: 'Remove task from checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
            { name: 'taskId', in: 'path', type: 'MongoId', required: true, description: 'Task ID' },
        ],
    });

    endpoints.push({
        id: 'task-toggle',
        name: 'Toggle Task Completion',
        method: 'POST',
        path: '/api/v2/check-lists/:id/tasks/:taskId/toggle',
        category: '3. Checklist Tasks',
        description: 'Toggle task completion status',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
            { name: 'taskId', in: 'path', type: 'MongoId', required: true, description: 'Task ID' },
        ],
        requestBody: {
            completed: 'boolean (required)',
        },
    });

    endpoints.push({
        id: 'task-reorder',
        name: 'Reorder Tasks',
        method: 'POST',
        path: '/api/v2/check-lists/:id/tasks/reorder',
        category: '3. Checklist Tasks',
        description: 'Reorder tasks within a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            taskOrders: [
                {
                    taskId: 'MongoId (required)',
                    position: 'number (required)',
                },
            ],
        },
    });

    endpoints.push({
        id: 'task-list',
        name: 'Get Tasks by Checklist ID',
        method: 'GET',
        path: '/api/v2/check-lists/:id/tasks',
        category: '3. Checklist Tasks',
        description: 'Returns list of tasks for a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
    });

    // 4. Assignment & Due Dates/Reminders
    endpoints.push({
        id: 'assign-member',
        name: 'Assign Member',
        method: 'POST',
        path: '/api/v2/check-lists/:id/assign',
        category: '4. Assignment & Due Dates',
        description: 'Assign a user or team to a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            assigned_to: 'MongoId (required)',
            assigned_user_type: 'User | TeamManagement (required)',
        },
    });

    endpoints.push({
        id: 'unassign-member',
        name: 'Unassign Member',
        method: 'POST',
        path: '/api/v2/check-lists/:id/unassign',
        category: '4. Assignment & Due Dates',
        description: 'Remove assignment from a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
    });

    endpoints.push({
        id: 'set-due-date',
        name: 'Set Due Date',
        method: 'POST',
        path: '/api/v2/check-lists/:id/due-date',
        category: '4. Assignment & Due Dates',
        description: 'Set a due date for a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            dueDate: 'ISO Date String (required)',
        },
    });

    endpoints.push({
        id: 'set-reminder',
        name: 'Set Reminder',
        method: 'POST',
        path: '/api/v2/check-lists/:id/reminder',
        category: '4. Assignment & Due Dates',
        description: 'Set a reminder for a checklist',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
        requestBody: {
            reminder: '5_minutes_before | 10_minutes_before | 15_minutes_before | 1_hour_before | 2_hours_before | 1_day_before | 2_days_before (required)',
        },
    });

    // 5. Checklist Report APIs
    endpoints.push({
        id: 'report-create',
        name: 'Create Report',
        method: 'POST',
        path: '/api/v2/check-list-reports',
        category: '5. Checklist Reports',
        description: 'Create a new checklist report',
        requestBody: {
            checklist_id: 'MongoId (required)',
            name: 'string (required)',
            type: 'BUILDING_INSPECTION_REPORT | FINAL_INSPECTION_REPORT (optional)',
            description: 'string (optional)',
            report_tasks: 'Array (optional)',
            attachments: 'Array (optional)',
        },
    });

    endpoints.push({
        id: 'report-update',
        name: 'Update Report',
        method: 'PUT',
        path: '/api/v2/check-list-reports/:id',
        category: '5. Checklist Reports',
        description: 'Update a checklist report',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
        ],
        requestBody: {
            name: 'string (optional)',
            description: 'string (optional)',
            type: 'string (optional)',
            attachments: 'Array (optional)',
        },
    });

    endpoints.push({
        id: 'report-get-by-checklist',
        name: 'Get Report by Checklist ID',
        method: 'GET',
        path: '/api/v2/check-list-reports/checklist/:checklistId',
        category: '5. Checklist Reports',
        description: 'Returns list of reports for a checklist',
        parameters: [
            { name: 'checklistId', in: 'path', type: 'MongoId', required: true, description: 'Checklist ID' },
        ],
    });

    endpoints.push({
        id: 'report-toggle-checked',
        name: 'Toggle Checked Status',
        method: 'POST',
        path: '/api/v2/check-list-reports/:id/mark-checked',
        category: '5. Checklist Reports',
        description: 'Toggle the checked/verified state of the report',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
        ],
        requestBody: {
            checked: 'boolean (required)',
        },
    });

    endpoints.push({
        id: 'report-add-note',
        name: 'Add Note',
        method: 'POST',
        path: '/api/v2/check-list-reports/:id/note',
        category: '5. Checklist Reports',
        description: 'Add a note to a report',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
        ],
        requestBody: {
            text: 'string (required)',
            attachments: 'Array (optional)',
        },
    });

    endpoints.push({
        id: 'report-delete-note',
        name: 'Delete Note',
        method: 'DELETE',
        path: '/api/v2/check-list-reports/:id/note/:noteId',
        category: '5. Checklist Reports',
        description: 'Delete a note from a report',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
            { name: 'noteId', in: 'path', type: 'MongoId', required: true, description: 'Note ID' },
        ],
    });

    // 6. Report Task APIs
    endpoints.push({
        id: 'report-task-create',
        name: 'Create Report Task',
        method: 'POST',
        path: '/api/v2/check-list-reports/:id/task',
        category: '6. Report Tasks',
        description: 'Create a task in a report',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
        ],
        requestBody: {
            name: 'string (required)',
            description: 'string (optional)',
            dueDate: 'ISO Date (optional)',
            assignee: 'MongoId (optional)',
        },
    });

    endpoints.push({
        id: 'report-task-update',
        name: 'Update Report Task',
        method: 'PUT',
        path: '/api/v2/check-list-reports/:id/task/:taskId',
        category: '6. Report Tasks',
        description: 'Update a task in a report',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
            { name: 'taskId', in: 'path', type: 'MongoId', required: true, description: 'Task ID' },
        ],
        requestBody: {
            name: 'string (optional)',
            description: 'string (optional)',
            completed: 'boolean (optional)',
            subType: 'string (optional)',
            attachments: 'Array (optional)',
        },
    });

    endpoints.push({
        id: 'report-task-toggle',
        name: 'Toggle Report Task Completion',
        method: 'POST',
        path: '/api/v2/check-list-reports/:id/task/:taskId/mark-completed',
        category: '6. Report Tasks',
        description: 'Toggle task completion status',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Report ID' },
            { name: 'taskId', in: 'path', type: 'MongoId', required: true, description: 'Task ID' },
        ],
        requestBody: {
            completed: 'boolean (required)',
        },
    });

    // 7. Template APIs
    endpoints.push({
        id: 'template-list',
        name: 'List Templates by Board List',
        method: 'GET',
        path: '/api/v2/check-list-templates/board-list/:boardListId',
        category: '7. Templates',
        description: 'Returns all templates available for a specific board list',
        parameters: [
            { name: 'boardListId', in: 'path', type: 'MongoId', required: true, description: 'Board List ID' },
        ],
    });

    endpoints.push({
        id: 'template-get',
        name: 'Get Template Details',
        method: 'GET',
        path: '/api/v2/check-list-templates/:id',
        category: '7. Templates',
        description: 'Returns template details including associated groups and items',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
        ],
    });

    endpoints.push({
        id: 'template-create',
        name: 'Create Template',
        method: 'POST',
        path: '/api/v2/check-list-templates',
        category: '7. Templates',
        description: 'Create a new template',
        requestBody: {
            name: 'string (required)',
            boardListId: 'MongoId (required)',
            description: 'string (optional)',
            isDefault: 'boolean (optional)',
        },
    });

    endpoints.push({
        id: 'template-update',
        name: 'Update Template',
        method: 'PUT',
        path: '/api/v2/check-list-templates/:id',
        category: '7. Templates',
        description: 'Update a template',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
        ],
        requestBody: {
            name: 'string (optional)',
            description: 'string (optional)',
            isDefault: 'boolean (optional)',
        },
    });

    endpoints.push({
        id: 'template-delete',
        name: 'Delete Template',
        method: 'DELETE',
        path: '/api/v2/check-list-templates/:id',
        category: '7. Templates',
        description: 'Delete a template',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
            { name: 'force', in: 'query', type: 'Boolean', required: false, description: 'Force delete even if in use' },
        ],
    });

    endpoints.push({
        id: 'template-duplicate',
        name: 'Duplicate Template',
        method: 'POST',
        path: '/api/v2/check-list-templates/:id/duplicate',
        category: '7. Templates',
        description: 'Duplicate a template',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
        ],
        requestBody: {
            name: 'string (required)',
            boardListId: 'MongoId (optional)',
        },
    });

    endpoints.push({
        id: 'template-set-default',
        name: 'Set Default Template',
        method: 'POST',
        path: '/api/v2/check-list-templates/:id/set-default',
        category: '7. Templates',
        description: 'Set a template as default for a board list',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Template ID' },
        ],
        requestBody: {
            boardListId: 'MongoId (required)',
        },
    });

    endpoints.push({
        id: 'template-get-default',
        name: 'Get Default Template',
        method: 'GET',
        path: '/api/v2/check-list-templates/board-list/:boardListId/default',
        category: '7. Templates',
        description: 'Returns default template for board list',
        parameters: [
            { name: 'boardListId', in: 'path', type: 'MongoId', required: true, description: 'Board List ID' },
        ],
    });

    endpoints.push({
        id: 'template-populate-default',
        name: 'Populate Default Templates',
        method: 'POST',
        path: '/api/v2/check-list-templates/board-list/:boardListId/populate-default',
        category: '7. Templates',
        description: 'Populates board list with default templates',
        parameters: [
            { name: 'boardListId', in: 'path', type: 'MongoId', required: true, description: 'Board List ID' },
        ],
    });

    endpoints.push({
        id: 'template-populate-existing',
        name: 'Populate from Existing Checklists',
        method: 'POST',
        path: '/api/v2/check-list-templates/board-list/:boardListId/populate-from-existing',
        category: '7. Templates',
        description: 'Creates template from existing checklists',
        parameters: [
            { name: 'boardListId', in: 'path', type: 'MongoId', required: true, description: 'Board List ID' },
        ],
    });

    // 8. Group APIs
    endpoints.push({
        id: 'group-list',
        name: 'List Groups by Template',
        method: 'GET',
        path: '/api/v2/check-list-groups',
        category: '8. Groups',
        description: 'Returns all groups belonging to the specified template',
        parameters: [
            { name: 'templateId', in: 'query', type: 'MongoId', required: true, description: 'Template ID' },
            { name: 'includeChecklists', in: 'query', type: 'Boolean', required: false, description: 'Include associated checklists' },
        ],
    });

    endpoints.push({
        id: 'group-get',
        name: 'Get Group by ID',
        method: 'GET',
        path: '/api/v2/check-list-groups/:id',
        category: '8. Groups',
        description: 'Get a specific group',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Group ID' },
            { name: 'includeChecklists', in: 'query', type: 'Boolean', required: false, description: 'Include associated checklists' },
        ],
    });

    endpoints.push({
        id: 'group-create',
        name: 'Create Group',
        method: 'POST',
        path: '/api/v2/check-list-groups',
        category: '8. Groups',
        description: 'Create a new group',
        requestBody: {
            name: 'string (required)',
            templateId: 'MongoId (required)',
            description: 'string (optional)',
            position: 'number (optional)',
        },
    });

    endpoints.push({
        id: 'group-update',
        name: 'Update Group',
        method: 'PUT',
        path: '/api/v2/check-list-groups/:id',
        category: '8. Groups',
        description: 'Update a group',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Group ID' },
        ],
        requestBody: {
            name: 'string (optional)',
            description: 'string (optional)',
            position: 'number (optional)',
        },
    });

    endpoints.push({
        id: 'group-delete',
        name: 'Delete Group',
        method: 'DELETE',
        path: '/api/v2/check-list-groups/:id',
        category: '8. Groups',
        description: 'Delete a group',
        parameters: [
            { name: 'id', in: 'path', type: 'MongoId', required: true, description: 'Group ID' },
            { name: 'moveChecklistsTo', in: 'query', type: 'MongoId', required: false, description: 'Move checklists to another group' },
        ],
    });

    endpoints.push({
        id: 'group-reorder',
        name: 'Reorder Groups',
        method: 'POST',
        path: '/api/v2/check-list-groups/reorder',
        category: '8. Groups',
        description: 'Reorder groups within a template',
        requestBody: {
            templateId: 'MongoId (required)',
            groupOrders: [
                {
                    groupId: 'MongoId (required)',
                    position: 'number (required)',
                },
            ],
        },
    });

    // 9. Card APIs
    endpoints.push({
        id: 'card-get-checklists',
        name: 'Get Card Checklists',
        method: 'GET',
        path: '/api/v2/cards/:card_id/checklists',
        category: '9. Card APIs',
        description: 'Get all checklists for a card',
        parameters: [
            { name: 'card_id', in: 'path', type: 'MongoId', required: true, description: 'Card ID' },
            { name: 'includeCompleted', in: 'query', type: 'Boolean', required: false, description: 'Include completed checklists (default: true)' },
            { name: 'templateId', in: 'query', type: 'MongoId', required: false, description: 'Filter by template ID' },
        ],
    });

    endpoints.push({
        id: 'card-apply-template',
        name: 'Apply Template to Card',
        method: 'POST',
        path: '/api/v2/cards/:card_id/apply-template',
        category: '9. Card APIs',
        description: 'Apply a template to a card',
        parameters: [
            { name: 'card_id', in: 'path', type: 'MongoId', required: true, description: 'Card ID' },
        ],
        requestBody: {
            templateId: 'MongoId (required)',
            options: 'Object (optional)',
        },
    });

    endpoints.push({
        id: 'card-switch-template',
        name: 'Switch Template for Card',
        method: 'POST',
        path: '/api/v2/cards/:card_id/switch-template',
        category: '9. Card APIs',
        description: 'Switch from one template to another for a card',
        parameters: [
            { name: 'card_id', in: 'path', type: 'MongoId', required: true, description: 'Card ID' },
        ],
        requestBody: {
            fromTemplateId: 'MongoId (required)',
            toTemplateId: 'MongoId (required)',
            options: 'Object (optional)',
        },
    });

    endpoints.push({
        id: 'card-available-templates',
        name: 'Get Available Templates for Card',
        method: 'GET',
        path: '/api/v2/cards/:card_id/available-templates',
        category: '9. Card APIs',
        description: 'Get all available templates for a card',
        parameters: [
            { name: 'card_id', in: 'path', type: 'MongoId', required: true, description: 'Card ID' },
            { name: 'boardListId', in: 'query', type: 'MongoId', required: false, description: 'Filter by board list' },
        ],
    });

    endpoints.push({
        id: 'card-move-checklist',
        name: 'Move Card Checklist',
        method: 'POST',
        path: '/api/v2/cards/:card_id/checklists/move-card-checklist',
        category: '9. Card APIs',
        description: 'Move a checklist from one card to another',
        parameters: [
            { name: 'card_id', in: 'path', type: 'MongoId', required: true, description: 'Card ID' },
        ],
        requestBody: {
            checklistId: 'MongoId (required)',
            targetCardId: 'MongoId (required)',
            targetPosition: 'number (required)',
        },
    });

    return endpoints;
}
