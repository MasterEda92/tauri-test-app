import { invoke } from "@tauri-apps/api/core";

export interface Class {
    id?: number;
    name: string;
    grade: number;
    section: string;
}

export interface Subject {
    id?: number;
    name: string;
    short_name: string;
}

export const classApi = {
    async create(class_: Class): Promise<number> {
        return invoke('create_class', { class: class_ });
    },

    async getById(id: number): Promise<Class> {
        return invoke('get_class', { id });
    },

    async getAll(): Promise<Class[]> {
        return invoke('get_all_classes');
    },

    async update(class_: Class): Promise<void> {
        return invoke('update_class', { class: class_ });
    },

    async delete(id: number): Promise<void> {
        return invoke('delete_class', { id });
    },
};

export const subjectApi = {
    async create(subject: Subject): Promise<number> {
        return invoke('create_subject', { subject: subject });
    },

    async getById(id: number): Promise<Subject> {
        return invoke('get_subject', { id });
    },

    async getAll(): Promise<Subject[]> {
        return invoke('get_all_subjects');
    },

    async update(subject: Subject): Promise<void> {
        return invoke('update_subject', { subject: subject });
    },

    async delete(id: number): Promise<void> {
        return invoke('delete_subject', { id });
    },
};
