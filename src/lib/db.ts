//import { invoke } from '@tauri-apps/api/tauri';
import { invoke } from "@tauri-apps/api/core";

export interface Class {
    id?: number;
    name: string;
    grade: number;
    section: string;
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
    }
};